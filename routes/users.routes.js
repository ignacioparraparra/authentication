const { authenticateToken } = require("../middlware/auth.middleware.js")
const express = require('express')
const router = express.Router()
const { sql } = require("../database/client.js")

/*
Secure endpoint that returns specific users post
*/
router.get('/view', authenticateToken, async (req, res) => {
    // get user from user attched to req, gets passed by authenticate token
    const user = req.user.name

    // get user_id from sql query using username to locate 
    const [user_id] = await sql `
        SELECT id FROM users
        WHERE username=${user}`

    // with user_id as foreign key we can look up all posts from that user
    const posts = await sql `
        SELECT * FROM posts
        WHERE user_id=${user_id.id}`
    
    // return post details to the frontend
    return res.json(posts);
})

router.post('/create', authenticateToken, async (req, res) => {
    // get user from user attached to req
    const user = req.user.name
    // get caption from req.body
    const caption = req.body.caption

    // query database to connect user to id
    const [user_id] = await sql `
        SELECT id FROM users
        WHERE username=${user}`

    // insert into db the new post 
    await sql `
        INSERT INTO posts (caption, user_id)
        VALUES (${caption}, ${user_id.id})`

    // return success message to the frontend
    return res.json("Post created!")
})

module.exports = router