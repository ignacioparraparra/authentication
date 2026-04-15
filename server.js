require('dotenv').config()
const { initializeDb } = require('./database/client');
const express = require('express')
const app = express()

const authRoutes = require('./routes/auth.routes.js')
const postRoutes = require('./routes/users.routes.js')

app.use(express.json())

// Routes with be prepended with
app.use('/auth', authRoutes) 
app.use('/post', postRoutes)

app.listen(process.env.PORT, (err) => {
    if (err) return console.log(`Server startup failed ${err}`)
    console.log(`Server listening on port ${process.env.PORT}`)
    initializeDb();
})