require('dotenv').config()
const express = require('express')
const app = express()

const authRoutes = require('./routes/auth.routes.js')
const postRoutes = require('./routes/users.routes.js')

app.use(express.json())

// Routes with be prepended with
app.use('/', authRoutes) 
app.use('/', postRoutes)

app.listen(process.env.PORT, (err) => {
    if (err) return console.log(`Server startup failed ${err}`)
    console.log(`Server listening on port ${process.env.PORT}`)
})