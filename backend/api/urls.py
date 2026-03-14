from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'transactions', views.TransactionViewSet)
router.register(r'budgets', views.BudgetViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/', views.dashboard_summary),
    path('insights/', views.ai_insights),
    path('anomalies/', views.anomaly_detection),
]