import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#7c3aed', '#059669', '#dc2626', '#d97706', '#2563eb', '#db2777'];

function StatCard({ icon, label, value, color, bg }) {
  return (
    <div style={{ background: bg, borderRadius: 16, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.10)', border: `1.5px solid ${color}22` }}>
      <div style={{ fontSize: 36, background: `${color}18`, borderRadius: 12, width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
      <div>
        <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 4, fontWeight: 500, letterSpacing: 1, textTransform: 'uppercase' }}>{label}</p>
        <h2 style={{ color, fontSize: '1.6rem', fontWeight: 700, margin: 0 }}>{value}</h2>
      </div>
    </div>
  );
}

function Dashboard({ transactions }) {
  const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = income - expense;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
      <StatCard icon="💳" label="Net Balance" value={`₹${balance.toLocaleString()}`} color={balance >= 0 ? '#059669' : '#dc2626'} bg="#0f172a" />
      <StatCard icon="📈" label="Total Income" value={`₹${income.toLocaleString()}`} color="#059669" bg="#0f172a" />
      <StatCard icon="📉" label="Total Expense" value={`₹${expense.toLocaleString()}`} color="#dc2626" bg="#0f172a" />
      <StatCard icon="📋" label="Transactions" value={transactions.length} color="#7c3aed" bg="#0f172a" />
    </div>
  );
}

function AddTransaction({ onAdd }) {
  const [form, setForm] = useState({ title: '', amount: '', type: 'expense', category: 'Food', date: '' });
  const categories = ['Food', 'Housing', 'Work', 'Entertainment', 'Transport', 'Health', 'Other'];
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.amount || !form.date) return alert('Please fill all fields!');
    onAdd({ ...form, amount: parseFloat(form.amount) });
    setForm({ title: '', amount: '', type: 'expense', category: 'Food', date: '' });
  };
  const inp = { width: '100%', padding: '11px 14px', marginBottom: 12, border: '1.5px solid #1e293b', borderRadius: 10, background: '#0f172a', color: '#e2e8f0', fontSize: '0.97rem', outline: 'none' };
  return (
    <div style={{ background: '#1e293b', borderRadius: 18, padding: 28, boxShadow: '0 4px 24px rgba(0,0,0,0.13)' }}>
      <h3 style={{ color: '#7c3aed', marginBottom: 20, fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>➕ Add Transaction</h3>
      <form onSubmit={handleSubmit}>
        <input style={inp} placeholder="Title (e.g. Salary, Rent)" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <input style={inp} type="number" placeholder="Amount in ₹" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
        <input style={inp} type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
        <select style={{ ...inp, marginBottom: 14 }} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
          {categories.map(c => <option key={c} style={{ background: '#1e293b' }}>{c}</option>)}
        </select>
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          {['income', 'expense'].map(t => (
            <button key={t} type="button" onClick={() => setForm({ ...form, type: t })}
              style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: `2px solid ${form.type === t ? (t === 'income' ? '#059669' : '#dc2626') : '#334155'}`, background: form.type === t ? (t === 'income' ? '#05966918' : '#dc262618') : 'transparent', color: form.type === t ? (t === 'income' ? '#059669' : '#dc2626') : '#64748b', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem', transition: 'all 0.2s' }}>
              {t === 'income' ? '📈 Income' : '📉 Expense'}
            </button>
          ))}
        </div>
        <button type="submit" style={{ width: '100%', padding: 13, background: 'linear-gradient(135deg, #7c3aed, #2563eb)', border: 'none', borderRadius: 12, color: 'white', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', letterSpacing: 0.5, boxShadow: '0 2px 12px #7c3aed44' }}>
          Add Transaction
        </button>
      </form>
    </div>
  );
}

function Charts({ transactions }) {
  const categoryData = transactions.reduce((acc, t) => {
    if (t.type === 'expense') {
      const found = acc.find(a => a.name === t.category);
      if (found) found.value += t.amount;
      else acc.push({ name: t.category, value: t.amount });
    }
    return acc;
  }, []);
  const monthlyData = [
    { month: 'Apr', Income: 45000, Expense: 22000 },
    { month: 'May', Income: 52000, Expense: 28000 },
    { month: 'Jun', Income: transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0), Expense: transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0) },
  ];
  return (
    <div style={{ background: '#1e293b', borderRadius: 18, padding: 28, boxShadow: '0 4px 24px rgba(0,0,0,0.13)' }}>
      <h3 style={{ color: '#7c3aed', marginBottom: 16, fontSize: '1.1rem', fontWeight: 700 }}>📊 Expense Breakdown</h3>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
            {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip formatter={(v) => [`₹${v.toLocaleString()}`, 'Amount']} contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0' }} />
        </PieChart>
      </ResponsiveContainer>
      <h3 style={{ color: '#7c3aed', margin: '20px 0 12px', fontSize: '1.1rem', fontWeight: 700 }}>📅 Monthly Overview</h3>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={monthlyData} barCategoryGap="30%">
          <XAxis dataKey="month" stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 13 }} />
          <YAxis stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
          <Tooltip formatter={(v) => [`₹${v.toLocaleString()}`]} contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0' }} />
          <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 13 }} />
          <Bar dataKey="Income" fill="#059669" radius={[6, 6, 0, 0]} />
          <Bar dataKey="Expense" fill="#dc2626" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function TransactionList({ transactions, onDelete }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const filtered = transactions
    .filter(t => filter === 'all' || t.type === filter)
    .filter(t => t.title.toLowerCase().includes(search.toLowerCase()));
  return (
    <div style={{ background: '#1e293b', borderRadius: 18, padding: 28, marginTop: 24, boxShadow: '0 4px 24px rgba(0,0,0,0.13)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
        <h3 style={{ color: '#7c3aed', fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>📋 Transaction History</h3>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <input placeholder="🔍 Search..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ padding: '8px 14px', border: '1.5px solid #334155', borderRadius: 10, background: '#0f172a', color: '#e2e8f0', fontSize: '0.9rem', outline: 'none', width: 160 }} />
          {['all', 'income', 'expense'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: '7px 16px', borderRadius: 20, border: `1.5px solid ${filter === f ? '#7c3aed' : '#334155'}`, background: filter === f ? '#7c3aed18' : 'transparent', color: filter === f ? '#7c3aed' : '#64748b', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem', textTransform: 'capitalize' }}>
              {f}
            </button>
          ))}
        </div>
      </div>
      {filtered.length === 0 && <p style={{ color: '#475569', textAlign: 'center', padding: '32px 0' }}>No transactions found.</p>}
      {filtered.map(t => (
        <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 4px', borderBottom: '1px solid #0f172a', transition: 'background 0.15s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: t.type === 'income' ? '#05966918' : '#dc262618', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
              {t.type === 'income' ? '📈' : '📉'}
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 600, color: '#e2e8f0', fontSize: '0.97rem' }}>{t.title}</p>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', marginTop: 2 }}>{t.category} • {t.date}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ color: t.type === 'income' ? '#059669' : '#dc2626', fontWeight: 700, fontSize: '1.05rem' }}>
              {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}
            </span>
            <button onClick={() => onDelete(t.id)}
              style={{ background: '#dc262618', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontSize: 16, color: '#dc2626', transition: 'all 0.2s' }}>
              🗑
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function App() {
  const [transactions, setTransactions] = useState([
    { id: '1', title: 'Salary', amount: 50000, type: 'income', category: 'Work', date: '2026-06-01' },
    { id: '2', title: 'Rent', amount: 15000, type: 'expense', category: 'Housing', date: '2026-06-02' },
    { id: '3', title: 'Groceries', amount: 3000, type: 'expense', category: 'Food', date: '2026-06-03' },
    { id: '4', title: 'Freelance', amount: 12000, type: 'income', category: 'Work', date: '2026-06-05' },
    { id: '5', title: 'Netflix', amount: 649, type: 'expense', category: 'Entertainment', date: '2026-06-06' },
  ]);
  const addTransaction = (t) => setTransactions([...transactions, { ...t, id: Date.now().toString() }]);
  const deleteTransaction = (id) => setTransactions(transactions.filter(t => t.id !== id));
  return (
    <div style={{ minHeight: '100vh', background: '#020617', padding: '0 0 40px' }}>
      <header style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', padding: '32px 40px 28px', marginBottom: 32, borderBottom: '1px solid #1e293b' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ color: '#a78bfa', fontSize: '2rem', fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>💰 FinTrack</h1>
          <p style={{ color: '#64748b', margin: '6px 0 0', fontSize: '1rem' }}>Personal Finance Manager — built with React.js</p>
        </div>
      </header>
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <Dashboard transactions={transactions} />
        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 24 }}>
          <AddTransaction onAdd={addTransaction} />
          <Charts transactions={transactions} />
        </div>
        <TransactionList transactions={transactions} onDelete={deleteTransaction} />
      </main>
    </div>
  );
}

export default App;