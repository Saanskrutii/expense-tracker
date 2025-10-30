const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(cors());
app.use(express.json());

console.log("Using database file:", require('path').resolve('./expenses.db'));
const db = new sqlite3.Database('./expenses.db');

// Prepare expenses table
db.run(`CREATE TABLE IF NOT EXISTS expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  description TEXT NOT NULL,
  amount REAL NOT NULL,
  date TEXT NOT NULL
)`);

// Get all expenses
app.get('/expenses', (req, res) => {
  db.all(`SELECT * FROM expenses ORDER BY date DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Add expense
app.post('/expenses', (req, res) => {
  const { description, amount, date } = req.body;
  if (!description || !amount || !date) {
    return res.status(400).json({ error: "All fields required" });
  }
  db.run(
    `INSERT INTO expenses(description, amount, date) VALUES(?, ?, ?)`,
    [description, amount, date],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      console.log("Expense added:", { description, amount, date });
      db.get(`SELECT * FROM expenses WHERE id = ?`, [this.lastID], (e, row) => res.status(201).json(row));
    }
  );
});
db.all("SELECT * FROM expenses", [], (err, rows) => { console.log(rows); });

// Delete expense
app.delete('/expenses/:id', (req, res) => {
  db.run(`DELETE FROM expenses WHERE id=?`, [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(204).end();
  });
});

// Edit expense
app.put('/expenses/:id', (req, res) => {
  const { description, amount, date } = req.body;
  db.run(
    `UPDATE expenses SET description=?, amount=?, date=? WHERE id=?`,
    [description, amount, date, req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      db.get(`SELECT * FROM expenses WHERE id = ?`, [req.params.id], (e, row) => res.json(row));
    }
  );
});

app.get('/', (req, res) => {
  res.json({ message: 'Expense Tracker API running!' });
});

module.exports = app;