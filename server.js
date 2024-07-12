const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const port = 5000;

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// MySQL Connection Pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'helloashish',
  password: 'password',
  database: 'hello',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Route to handle POST requests to add data
app.post('/api/data', async (req, res) => {
  const { name, description } = req.body;
  try {
    const connection = await pool.getConnection();
    await connection.query(
      'INSERT INTO data (name, description) VALUES (?, ?)',
      [name, description]
    );
    connection.release();
    res.status(201).json({ message: 'Data added successfully' });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Error inserting data' });
  }
});

// Route to handle GET requests to fetch all data
app.get('/api/data', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM data');
    connection.release();
    console.log('Fetched data:', rows);
    res.json(rows); // Send the fetched rows (data) as JSON response
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.send('Welcome to my backend server!');
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://47.129.53.171:${port}`);
});
