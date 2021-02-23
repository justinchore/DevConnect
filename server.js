const express = require('express');
const connectDB = require('./config/db');

const app = express(); //initialize app variable

// Connect Database
connectDB();

app.get('/', (req, res) => res.send('API Running')); //Test server

const PORT = process.env.PORT || 5000; //where app will listen!

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));//On successful connect




