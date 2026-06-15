import { useState, useEffect } from 'react';
import { Target, Plus } from 'lucide-react';
import api from '../api';
import Card from '../components/Card';
import './Budgets.css';

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: 'food',
    monthly_limit: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });

  const categories = ['food', 'transport', 'shopping', 'entertainment', 'health', 'bills', 'other'];

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const res = await api.get('budgets/');
      setBudgets(res.data);
    } catch (error) {
      console.error('Failed to fetch budgets', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('budgets/', formData);
      setShowForm(false);
      setFormData({ ...formData, monthly_limit: '' });
      fetchBudgets();
    } catch (error) {
      console.error('Failed to create budget', error);
    }
  };

  if (loading) return <div className="flex-center" style={{ height: '50vh' }}><div className="loader"></div></div>;

  return (
    <div className="animate-fade-in">
      <div className="flex-between page-header">
        <div>
          <h1>Budgets</h1>
          <p className="text-secondary">Set and manage your monthly spending limits</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> New Budget
        </button>
      </div>

      {showForm && (
        <Card className="mb-lg form-card glow-effect">
          <form onSubmit={handleSubmit}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Monthly Limit ($)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  required 
                  value={formData.monthly_limit}
                  onChange={e => setFormData({...formData, monthly_limit: e.target.value})}
                  placeholder="0.00" 
                />
              </div>
            </div>
            <div className="flex-between mt-md">
              <button type="button" className="btn text-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save Budget</button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid-3">
        {budgets.length === 0 ? (
          <div className="text-muted" style={{ gridColumn: '1 / -1' }}>No budgets set. Create one to get started!</div>
        ) : (
          budgets.map(budget => (
            <Card key={budget.id} className="budget-card">
              <div className="budget-header">
                <div className="budget-icon">
                  <Target size={20} className="text-primary" />
                </div>
                <span className={`badge badge-${budget.category}`}>{budget.category}</span>
              </div>
              <div className="budget-body">
                <p className="text-secondary mb-xs">Monthly Limit</p>
                <h2>${Number(budget.monthly_limit).toFixed(2)}</h2>
                <p className="text-xs text-muted mt-sm">Valid for {budget.month}/{budget.year}</p>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
