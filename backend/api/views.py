from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Sum
from datetime import date
import google.generativeai as genai
import os
from dotenv import load_dotenv
from .models import Transaction, Budget
from .serializers import TransactionSerializer, BudgetSerializer

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all().order_by('-date')
    serializer_class = TransactionSerializer

class BudgetViewSet(viewsets.ModelViewSet):
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer

@api_view(['GET'])
def dashboard_summary(request):
    today = date.today()
    transactions = Transaction.objects.filter(date__month=today.month, date__year=today.year)
    total_spent = transactions.aggregate(Sum('amount'))['amount__sum'] or 0
    by_category = transactions.values('category').annotate(total=Sum('amount'))

    return Response({
        'total_spent': total_spent,
        'by_category': list(by_category),
        'transaction_count': transactions.count()
    })

@api_view(['POST'])
def ai_insights(request):
    try:
        today = date.today()
        transactions = Transaction.objects.filter(date__month=today.month, date__year=today.year)
        total_spent = transactions.aggregate(Sum('amount'))['amount__sum'] or 0
        by_category = list(transactions.values('category').annotate(total=Sum('amount')))

        prompt = f"""
        You are a personal finance advisor. Analyze this spending data and give 3 short, 
        personalized savings tips in simple language.

        This month's total spending: ${total_spent}
        Spending by category: {by_category}

        Give practical, friendly advice in bullet points.
        """

        model = genai.GenerativeModel('gemini-flash-latest')
        response = model.generate_content(prompt)
        return Response({'insights': response.text})
    except Exception as e:
        return Response({'insights': 'Add your Gemini API key to get AI insights!'}, status=200)

@api_view(['GET'])
def anomaly_detection(request):
    transactions = Transaction.objects.all()
    anomalies = []

    for category in ['food', 'transport', 'shopping', 'entertainment', 'health', 'bills', 'other']:
        cat_transactions = transactions.filter(category=category)
        if cat_transactions.count() > 2:
            amounts = [float(t.amount) for t in cat_transactions]
            avg = sum(amounts) / len(amounts)
            for t in cat_transactions:
                if float(t.amount) > avg * 2:
                    anomalies.append({
                        'id': t.id,
                        'title': t.title,
                        'amount': float(t.amount),
                        'category': t.category,
                        'date': t.date,
                        'reason': f'This is more than 2x the average for {category} (avg: ${avg:.2f})'
                    })

    return Response({'anomalies': anomalies})