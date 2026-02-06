require('dotenv').config()
const express = require('express')
const app = express()

const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')
// the longer the harder to break, but consumes time
const saltRounds = 1
const testHash = "$2b$10$sYxy7cOwxKLc9JYt/Bb7SeDx80esqT34z7tpo5EtK4zIGExiULFwe"

// Would come from db in prod
let refreshTokens = []

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

/*
Secure endpoint that returns specific users post
*/
app.get('/post', authenticateToken, (req, res) => {
    // in prod this would be DB query
    res.json(posts.filter(post => post.username === req.user.name))
})

/*
Generates new access token by verifying refresh token
*/
app.post('/token', (req, res) => {
    // refreshing token
    const refreshToken = req.body.token
    if (refreshToken == null) return res.sendStatus(401)
    // do we have a valid refreshToken in db
    if (!refreshTokens.includes(refreshToken)) return res.status(403).send('token not valid')
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).send('Failed to verify')
        const accessToken = generateAccessToken({name : user.name})
        res.json({accessToken : accessToken})
    })
})

/* 
Creates user with req.body params, adds salt and hashes password.
Returns details, in prod store details in db at this point
*/
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

/*
Takes username and password from req.body params.
Compares hash with hash in "db", if match issue JWT
User in now authenticated, returns access and refresh token
*/
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
            const accessToken = generateAccessToken(user)
            // manually handle expiration of refresh token
            const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
            // login will generate a access & refresh token
            // for testing, prod would put this in db
            refreshTokens.push(refreshToken)
            return res.json({accessToken : accessToken, refreshToken : refreshToken})
        }

        return res.sendStatus(403)
    }

    return checkUser(user, password)
})

/*
Logs user out by deleting refresh token from "db", revoking auth
*/
app.delete('/logout', (req, res) => {
    // would delete from a db in prod
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204)
})

/*
Takes Bearer Token from header and verifies if JWT is valid.
If valid, attach user details to req and go to next
*/
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

/*
Generates new access token, short lived
*/ 
function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1m'})
}


app.listen(process.env.PORT, (err) => {
    if (err) return console.log('Server startup failed')
    console.log(`Server listening on port ${process.env.PORT}`)
})