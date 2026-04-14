require('dotenv').config()
const { sql } = require("../database/client")
const express = require('express')
const router = express.Router()
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')
// the longer the harder to break, but consumes time
const saltRounds = 1
// Would come from db in prod

/*
Takes username and password from req.body params.
Compares hash with hash in "db", if match issue JWT
User in now authenticated, returns access and refresh token
*/
router.post('/login', async (req, res) => {
    // fetch user from db
    const username = req.body.username
    const password = req.body.password
    // serializing user, var : value, attached to accessToken
    const user = { name : username }
    // also need to collect password
    // and compare with hash in db
    // would need to grab hash from db
    const db_hash = await sql`
        SELECT password 
        FROM users
        WHERE username = ${username}
    `
    const match = await bcrypt.compare(password, db_hash)

    // login
    if(match) {
        // signing new jwt
        const accessToken = generateAccessToken(user)
        // manually handle expiration of refresh token
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
        // login will generate a access & refresh token
        // for testing, prod would put this in db
        // refreshTokens.push(refreshToken)
        const db_user = await sql`
            INSERT INTO users (
                refresh_token
            ) VALUES (
                ${refreshToken}
            )

            returning *
        `
        if (!db_user)
            return res.sendStatus(404)

        return res.json({accessToken : accessToken, refreshToken : refreshToken})
    }

    return res.sendStatus(403)
})

/*
Logs user out by deleting refresh token from "db", revoking auth
*/
router.delete('/logout', async (req, res) => {
    // would delete from a db in prod
    // refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    const result = await sql`
        UPDATE users
        SET refresh_token = NULL
        WHERE refresh_token = ${req.body.token}
    `
    if (!result)
        return res.sendStatus(404)
    res.sendStatus(204)
})

/* 
Creates user with req.body params, adds salt and hashes password.
Returns details, in prod store details in db at this point
*/
router.post('/signup', (req, res) => {
    const username = req.body.username
    const password = req.body.password
    // auto gen salt and hash
    bcrypt.hash(password, saltRounds, function(err, hash) {
        // Store hash and user in your password DB.
        if (err) return res.sendStatus(500)

        async function createUser() {
            try {
                await sql `
                INSERT INTO users (name, password) VALUES (${username}, ${hash})
                RETURNING name`       
                return res.send('User Created');
            } catch (err) {
                if (err.code === '23505') {
                    return res.send('Username Taken')
                } else {
                    return res.send(err);
                }
            }
        }

    createUser();
    });
})

/*
Generates new access token by verifying refresh token
*/
router.post('/token', async (req, res) => {
    // refreshing token
    const refreshToken = req.body.token
    if (refreshToken == null) return res.sendStatus(401)
    // do we have a valid refreshToken in db
    // if (!refreshTokens.includes(refreshToken)) return res.status(403).send('token not valid')
    const validRefreshToken = await sql`
        SELECT * FROM users
        WHERE users.refresh_token = ${refreshToken}
    `;

    if (!validRefreshToken)
        return res.status('403').send('token not valid');

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).send('Failed to verify')
        const accessToken = generateAccessToken({name : user.name})
        res.json({accessToken : accessToken})
    })
})

/*
Generates new access token, short lived
*/ 
function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1m'})
}

module.exports = router