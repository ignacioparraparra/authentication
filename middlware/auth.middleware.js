require('dotenv').config()
const jwt = require('jsonwebtoken')
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

module.exports = { authenticateToken }