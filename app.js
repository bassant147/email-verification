const cors = require('cors')
const express = require('express');
require('dotenv').config();
const morgan = require('morgan');

const checkRouter = require('./routes/checkRoutes')
const userRouter = require('./routes/userRoutes')

const app = express();

// middlewares

app.use(morgan('dev'))

// (middleware) the data of the body is added to the req
app.use(express.json());
app.use(cors())

app.use((req, res, next) => {
    console.log('hello from the middleware')
    next()
})

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    next()
})

app.use('/checks/', checkRouter)
app.use('/user', userRouter)

module.exports = app;


