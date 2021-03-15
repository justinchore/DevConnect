const express = require('express');
const connectDB = require('./config/db');
const path = require('path'); //node module for filepaths PRODUCTION

const app = express(); //initialize app variable

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// app.get('/', (req, res) => res.send('API Running')); //Test server GET RID OF IN PRODUCTION

//Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

//PRODUCTION
//Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000; //where app will listen!

app.listen(PORT, () => console.log(`Server started on port ${PORT}`)); //On successful connect
