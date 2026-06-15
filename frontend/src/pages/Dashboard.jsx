import { useState, useEffect } from 'react';
import { DollarSign, Activity, AlertTriangle, Sparkles, TrendingUp } from 'lucide-react';
import api from '../api';
import Card from '../components/Card';
import './Dashboard.css';

export default function Dashboard() {
  const [summary, setSummary] = useState({ total_spent: 0, by_category: [], transaction_count: 0 });
  const [insights, setInsights] = useState(null);
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [summaryRes, anomaliesRes] = await Promise.all([
        api.get('dashboard/'),
        api.get('anomalies/')
      ]);
      setSummary(summaryRes.data);
      setAnomalies(anomaliesRes.data.anomalies);
      
      // Fetch insights separately as it might be slower (LLM call)
      api.post('insights/').then(res => setInsights(res.data.insights)).catch(console.error);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex-center" style={{ height: '50vh' }}><div className="loader"></div></div>;
  }

  // Calculate max category total for progress bars
  const maxCategoryTotal = summary.by_category.length > 0 
    ? Math.max(...summary.by_category.map(c => Number(c.total))) 
    : 1;

  return (
    <div className="dashboard-container animate-fade-in">
      <header className="page-header">
        <h1>Overview</h1>
        <p className="text-secondary">Welcome back! Here's your financial summary for this month.</p>
      </header>

      <div className="grid-3 mb-xl">
        <Card glow={true}>
          <div className="stat-card">
            <div className="stat-icon bg-primary-glow">
              <DollarSign size={24} className="text-primary" />
            </div>
            <div>
              <p className="text-secondary">Total Spent</p>
              <h2>${Number(summary.total_spent).toFixed(2)}</h2>
            </div>
          </div>
        </Card>
        <Card>
          <div className="stat-card">
            <div className="stat-icon bg-success-glow">
              <Activity size={24} className="text-success" />
            </div>
            <div>
              <p className="text-secondary">Transactions</p>
              <h2>{summary.transaction_count}</h2>
            </div>
          </div>
        </Card>
        <Card>
          <div className="stat-card">
            <div className="stat-icon bg-warning-glow">
              <AlertTriangle size={24} className="text-warning" />
            </div>
            <div>
              <p className="text-secondary">Anomalies Detected</p>
              <h2>{anomalies.length}</h2>
            </div>
          </div>
        </Card>
      </div>

      <div className="dashboard-grid">
        <Card title="Spending by Category" className="category-card">
          {summary.by_category.length === 0 ? (
            <p className="text-muted">No transactions this month.</p>
          ) : (
            <div className="category-list">
              {summary.by_category.map((cat, index) => (
                <div key={index} className="category-item">
                  <div className="flex-between mb-xs">
                    <span className="capitalize">{cat.category}</span>
                    <span>${Number(cat.total).toFixed(2)}</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div 
                      className="progress-bar-fill" 
                      style={{ width: `${(Number(cat.total) / maxCategoryTotal) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <div className="dashboard-sidebar">
          <Card className="mb-lg ai-card" glow={true}>
            <div className="ai-header">
              <Sparkles className="ai-icon" size={20} />
              <h3>AI Insights</h3>
            </div>
            <div className="ai-content">
              {insights ? (
                <div dangerouslySetInnerHTML={{ __html: insights.replace(/\n/g, '<br/>') }} />
              ) : (
                <div className="flex-center gap-sm text-muted">
                  <div className="pulse-dot"></div> Analyzing your spending...
                </div>
              )}
            </div>
          </Card>

          <Card title="Anomalies">
            {anomalies.length === 0 ? (
              <p className="text-success flex-center gap-sm mt-md">
                <TrendingUp size={18} /> No anomalies found!
              </p>
            ) : (
              <div className="anomaly-list mt-md">
                {anomalies.map(anomaly => (
                  <div key={anomaly.id} className="anomaly-item">
                    <AlertTriangle size={16} className="text-warning" />
                    <div>
                      <p className="font-medium">{anomaly.title} <span className="text-warning">${anomaly.amount}</span></p>
                      <p className="text-xs text-secondary">{anomaly.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
