const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const express = require('express');

const app = express();

app.use(cors());

const mongoURI = process.env.MONGODB_URI;
async function connect(){
    try{
        mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000, // Increase the timeout value
        });
    console.log('connected to MongoDB.');
    }catch(error){
        console.error(error);
    }
}

connect();
const db = mongoose.connection;

db.on('connected', () => {
  console.log('MongoDB connected successfully');
});

db.on('error', (err) => {
  console.log('MongoDB connection error:', err);
});

db.on('disconnected', () => {
  console.log('MongoDB disconnected');
});
const PORT = process.env.PORT || 3001;
module.exports = db;