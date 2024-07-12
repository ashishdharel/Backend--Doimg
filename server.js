const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL Connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'helloashish',
  password: 'password',
  database: 'hello'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// API endpoints
app.get('/api/data', (req, res) => {
  connection.query('SELECT * FROM data', (error, results) => {
    if (error) {
      console.error('Error executing MySQL query:', error);
      res.status(500).json({ error: 'Error fetching data' });
    } else {
      res.json(results);
    }
  });
});

app.post('/api/data', (req, res) => {
  const { name, description } = req.body;
  const insertQuery = 'INSERT INTO data (name, description) VALUES (?, ?)';
  connection.query(insertQuery, [name, description], (error, results) => {
    if (error) {
      console.error('Error executing MySQL query:', error);
      res.status(500).json({ error: 'Error adding data' });
    } else {
      console.log(`Inserted ${results.affectedRows} row(s)`);
      res.status(201).json({ message: 'Data added successfully' });
    }
  });
});

// Error handling for invalid routes
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Internal server error:', err);
  res.status(500).json({ error: 'Something went wrong' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
