const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'helloashish',
    password: 'password',
    database: 'hello'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        throw err;
    }
    console.log('Connected to MySQL');
});

// Insert data into the 'new' table with two fields: data1 and data2
app.post('/api/storedata', (req, res) => {
    const { data1, data2 } = req.body;
    const sql = 'INSERT INTO newdata (data1, data2) VALUES (?, ?)';
    db.query(sql, [data1, data2], (err, result) => {
        if (err) {
            console.error('Error storing data:', err);
            res.status(500).json({ message: 'Error storing data' });
            return;
        }
        res.status(200).json({ message: 'Data stored successfully' });
    });
});

// Retrieve all data from the 'new' table
app.get('/api/getdata', (req, res) => {
    const sql = 'SELECT * FROM newdata';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).json({ message: 'Error fetching data' });
            return;
        }
        res.status(200).json(results);
    });
});

// Delete data from the 'new' table by ID
app.delete('/api/deletedata/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM newdata WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error deleting data:', err);
            res.status(500).json({ message: 'Error deleting data' });
            return;
        }
        res.status(200).json({ message: 'Data deleted successfully' });
    });
});

// Basic API endpoint to check if the server is running
app.get('/', (req, res) => {
    res.send('Backend server is running.');
});

// Start the server
app.listen(port, () => {
    console.log(`Backend server is running on http://ec2ip:${port}`);
});
