// backend/index.js
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

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

// Route to handle GET requests to the root endpoint
app.get('/', (req, res) => {
    res.send('Welcome to my backendd server!');
  });

  // GET all data
router.get('/data', (req, res) => {
  pool.query('SELECT * FROM your_table_name', (error, results) => {
    if (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ message: 'Error fetching data' });
    } else {
      res.json(results);
    }
  });
});

  
// Start server
app.listen(port, () => {
  console.log(`Server is running on http://47.129.53.171:${port}`);
});
