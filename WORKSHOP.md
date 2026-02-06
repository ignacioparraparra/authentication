## Workshop Prereqs
    Shell Commands
        sudo apt install npm nodejs
        npm init -y
        npm i express jsonwebtoken bcrypt dotenv
        npm i --save-dev nodemon
    Nodemon Config
        package.json -> "scripts": { "start" : "nodemon server.js" }

## Summary of Content
    1. Hello World
    2. Creating sign up & login endpoints
    3. Generating access JWTs
    4. Securing endpoints with middleware
    5. Implementing bcrypt for hash + salt
    6. Refreshing access tokens with refresh token