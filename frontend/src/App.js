import React, { useState, useEffect } from "react";

const App = () => {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ description: "", amount: "", date: "" });

  // Fetch expenses from backend
  useEffect(() => {
    fetch("/expenses")
      .then(res => res.json())
      .then(setExpenses);
  }, []);

  // Add expense
  const addExpense = e => {
    e.preventDefault();
    fetch("/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(exp => setExpenses(prev => [...prev, exp]));
    setForm({ description: "", amount: "", date: "" });
  };

  // Delete expense
  const deleteExpense = id => {
    fetch(`/expenses/${id}`, { method: "DELETE" })
      .then(() => setExpenses(prev => prev.filter(exp => exp.id !== id)));
  };

  return (
    <div>
      <h1>Expense Tracker</h1>
      <form onSubmit={addExpense} style={{ marginBottom: "16px" }}>
        <input
          placeholder="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={e => setForm({ ...form, amount: e.target.value })}
          required
        />
        <input
          type="date"
          value={form.date}
          onChange={e => setForm({ ...form, date: e.target.value })}
          required
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {expenses.map(exp => (
          <li key={exp.id}>
            {exp.date} - {exp.description} - ${exp.amount}
            <button onClick={() => deleteExpense(exp.id)} style={{marginLeft: 8}}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;