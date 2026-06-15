# 💰 SpendSmart — AI Personal Finance Tracker

A full-stack AI-powered personal finance tracker that analyzes your expenses and generates personalized savings insights using Google Gemini AI.

---

## 🚀 Features

- **📊 Dashboard** — Visual overview of monthly spending with pie charts
- **💳 Transactions** — Add, view, and delete expense transactions with category tagging
- **🎯 Budgets** — Set monthly budgets per category and track spending vs limits with bar charts
- **🤖 AI Insights** — Get personalized savings tips powered by Google Gemini AI
- **🚨 Anomaly Detection** — Automatically flags unusual spending patterns based on historical data

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Recharts, Axios, React Router |
| Backend | Python, Django, Django REST Framework |
| Database | SQLite (via Django ORM) |
| AI | Google Gemini API |
| Styling | Custom CSS |

---

## 📁 Project Structure

```
SpendSmart/
├── backend/
│   ├── api/
│   │   ├── models.py        # Transaction & Budget models
│   │   ├── views.py         # API views + AI insights + anomaly detection
│   │   ├── serializers.py   # DRF serializers
│   │   └── urls.py          # API routes
│   ├── spendsmart/
│   │   ├── settings.py      # Django settings
│   │   └── urls.py          # Root URL config
│   └── manage.py
└── frontend/
    ├── src/
    │   ├── components/      # Reusable UI elements (Card, Layout, Sidebar)
    │   ├── pages/
    │   │   ├── Dashboard.jsx  # Main dashboard with charts, AI insights & anomalies
    │   │   ├── Transactions.jsx # Transaction management and categories
    │   │   └── Budgets.jsx    # Budget tracking and configuration
    │   ├── api.js           # Axios API service configuration
    │   ├── App.jsx          # Root application with router
    │   ├── index.css        # Premium custom CSS variables & styling
    │   └── main.jsx         # Vite application entry point
    ├── index.html           # HTML template
    ├── package.json         # Node package configuration
    └── vite.config.js       # Vite configuration
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Python 3.9+
- Node.js 18+
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/AdrielJoseph25/SpendSmart.git
cd SpendSmart
```

### 2. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install django djangorestframework django-cors-headers google-generativeai python-dotenv
python3 manage.py migrate
python3 manage.py runserver
```

### 3. Frontend Setup
Open a new terminal tab:
```bash
cd frontend
npm install
npm run dev
```
*(Frontend runs at `http://localhost:5173`)*

### 4. Add Gemini API Key (for AI Insights)
Create a `.env` file in the `backend/` folder:
```
GEMINI_API_KEY=your_api_key_here
```
Get your free API key at: https://aistudio.google.com

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions/` | List all transactions |
| POST | `/api/transactions/` | Add a transaction |
| DELETE | `/api/transactions/{id}/` | Delete a transaction |
| GET | `/api/budgets/` | List all budgets |
| POST | `/api/budgets/` | Add a budget |
| GET | `/api/dashboard/` | Monthly spending summary |
| POST | `/api/insights/` | Get AI savings tips |
| GET | `/api/anomalies/` | Detect unusual spending |

---

## 🧠 Skills Demonstrated

- **NLP & AI Integration** — Google Gemini API for personalized financial advice
- **Data Visualization** — Interactive pie and bar charts with Recharts
- **REST API Development** — Django REST Framework with full CRUD operations
- **Database Management** — Django ORM with SQLite
- **Full-Stack Development** — React frontend + Django backend
- **Anomaly Detection** — Statistical analysis to flag unusual spending patterns

---

## 👤 Author

**AdrielJoseph25**  
GitHub: [@AdrielJoseph25](https://github.com/AdrielJoseph25)

---
