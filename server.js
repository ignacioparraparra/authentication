require('dotenv').config()
const express = require('express')
const app = express()

const jwt = require("jsonwebtoken")

posts = [
    {
        username : "Bob",
        likes : 10
    },
    {
        username : "John",
        likes : 20
    },
    {
        username : "Alex",
        likes : 1000
    }
]

app.use(express.json())

// gets post
app.get('/post', authenticateToken, (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name))
})

app.post('/login', (req, res) => {
    const username = req.body.username
    // serializing user, var : value, attached to accessToken
    const user = {name : username}

    // signing new jwt
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)

    // login will generate a access token
    res.json({accessToken : accessToken})
})

function authenticateToken(req, res, next) {
    // get Bearer : token from request header and store in token
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    // We have a token, verify if valid
    // takes a callback with a error and the object we serialized
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403) // token in valid
        req.user = user
        next()
    })
}



app.listen(9890)