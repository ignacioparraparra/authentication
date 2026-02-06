const express = require('express')
const app = express()

posts = [
    {
        username : "Bob",
        likes : 10
    }
]

app.use(express.json())

// gets posts
app.get('/posts', (req, res) => {
    res.json(posts[0])
})

console.log("hello")

app.listen(9890)