const mongoose = require('mongoose')
const dotenv = require('dotenv').config();
const app = require('./app')

// Initialize DB
require('./initDB')();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`app running on port ${PORT}...`)
})