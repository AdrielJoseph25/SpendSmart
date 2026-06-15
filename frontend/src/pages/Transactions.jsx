import { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import api from '../api';
import Card from '../components/Card';
import './Transactions.css';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'other',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  const categories = ['food', 'transport', 'shopping', 'entertainment', 'health', 'bills', 'other'];

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await api.get('transactions/');
      setTransactions(res.data);
    } catch (error) {
      console.error('Failed to fetch transactions', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('transactions/', formData);
      setShowForm(false);
      setFormData({ ...formData, title: '', amount: '', description: '' });
      fetchTransactions();
    } catch (error) {
      console.error('Failed to create transaction', error);
    }
  };

  if (loading) return <div className="flex-center" style={{ height: '50vh' }}><div className="loader"></div></div>;

  return (
    <div className="animate-fade-in">
      <div className="flex-between page-header">
        <div>
          <h1>Transactions</h1>
          <p className="text-secondary">View and manage your recent spending</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> Add Transaction
        </button>
      </div>

      {showForm && (
        <Card className="mb-lg form-card glow-effect">
          <form onSubmit={handleSubmit} className="transaction-form">
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Title</label>
                <input 
                  type="text" 
                  required 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g. Grocery store" 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Amount ($)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  required 
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: e.target.value})}
                  placeholder="0.00" 
                />
              </div>
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
                <label className="form-label">Date</label>
                <input 
                  type="date" 
                  required 
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Description (Optional)</label>
              <textarea 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                rows="2"
              ></textarea>
            </div>
            <div className="flex-between mt-md">
              <button type="button" className="btn text-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save Transaction</button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        <div className="table-responsive">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Title</th>
                <th>Category</th>
                <th className="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-muted" style={{ padding: '2rem' }}>No transactions found</td>
                </tr>
              ) : (
                transactions.map(t => (
                  <tr key={t.id}>
                    <td className="text-secondary">{t.date}</td>
                    <td className="font-medium">{t.title}</td>
                    <td>
                      <span className={`badge badge-${t.category}`}>{t.category}</span>
                    </td>
                    <td className="text-right font-medium text-danger">
                      -${Number(t.amount).toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
