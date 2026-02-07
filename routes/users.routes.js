const { authenticateToken } = require("../middlware/auth.middleware.js")
const express = require('express')
const router = express.Router()

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

/*
Secure endpoint that returns specific users post
*/
router.get('/post', authenticateToken, (req, res) => {
    // in prod this would be DB query
    res.json(posts.filter(post => post.username === req.user.name))
})

module.exports = router