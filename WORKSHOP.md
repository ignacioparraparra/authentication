## Workshop Prereqs
    Shell Commands
        sudo apt install npm nodejs git
    If Windows or MacOS you can navigate to
        https://nodejs.org/en/download/
    Install Docker
        https://docs.docker.com/engine/install/

## Project Dependencies
    Shell commands in project directory 
        npm init -y
        npm i express jsonwebtoken bcrypt dotenv
        npm i --save-dev nodemon
    Nodemon Config in package.json, allows us to run server with npm run dev
        "scripts": { "dev" : "nodemon server.js", "start" : "node server.js" }

## Summary of Content
    1. Hello World
        - Setup Nodejs boilerplate (imports, app.listen)
    2. Creating post, sign up, login endpoints
        - Create outline of endpoints
    3. Generating access JWTs
        - Setup JWT signing in login
    4. Securing endpoints with middleware
        - Develop authentication middleware to verify tokens before secure endpoint
    5. Implementing bcrypt for hash + salt
        - Add bcrypt hash and salt to signup, and compare in login
    6. Refreshing access tokens with refresh token
        - Implement generateToken function and call through endpoint
    7. Refactor code and containerize
        - Warm and fuzzy with setting up Docker and clean up code
