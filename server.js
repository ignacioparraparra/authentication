require('dotenv').config()
const express = require('express')
const app = express()

const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')
// the longer the harder to break, but consumes time
const saltRounds = 10
const correctPass = "password"
const wrongPass = "nullpass"
const testHash = "$2b$10$sYxy7cOwxKLc9JYt/Bb7SeDx80esqT34z7tpo5EtK4zIGExiULFwe"
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
    // in prod this would be DB query
    res.json(posts.filter(post => post.username === req.user.name))
})

app.post('/signup', (req, res) => {
    const username = req.body.username
    const password = req.body.password
    // auto gen salt and hash
    bcrypt.hash(password, saltRounds, function(err, hash) {
        // Store hash and user in your password DB.
        if (err) return res.sendStatus(500)
        res.json({username, hash})
    });
})

app.post('/login', (req, res) => {
    // fetch user from db
    const username = req.body.username
    const password = req.body.password
    // serializing user, var : value, attached to accessToken
    const user = { name : username }
    // also need to collect password
    // and compare with hash in db
    async function checkUser(user, password) {
        // would need to grab hash from db
        const match = await bcrypt.compare(password, testHash)

        // login
        if(match) {
            // signing new jwt
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)

            // login will generate a access token
            return res.json({accessToken : accessToken})
        }

        return res.sendStatus(403)
    }

    return checkUser(user, password)
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