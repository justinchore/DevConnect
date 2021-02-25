const mongoose = require('mongoose');
const config = require('config'); //use config variables
const db = config.get('mongoURI');

const connectDB = async () => {
    try {
        await mongoose.connect(db, { //returns a promise, so await
            useNewUrlParser: true, //deprecation errors
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        console.log('MongoDB Connected...')
    } catch(err) {
        console.error(err.message);
        // Exit process with failure
        process.exit(1);
    }
}

module.exports = connectDB; //to be used in server.js