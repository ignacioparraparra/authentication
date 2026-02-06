# Authentication with Nodejs
Basic implementation of authentication for a node js backend

## About The Project
Mini project showing a way of implementing JWT and bcrypt for a Nodejs backend.
This project does not include a database as the purpose is to focus this workshop
on solely authentication. 

## Building and Running
Requires Docker to be setup on your system
1. Navigate to project directory.
2. clone repo
    ```
    git clone https://github.com/ignacioparraparra/authentication.git
    ```
   Create .env in project directory and set
    ```
    ACCESS_TOKEN_SECRET="STRINGOFCHARS"
    REFRESH_TOKEN_SECRET="STRINGOFCHARS"
    PORT=8980
    ```
3. Navigate to project folder and build image
    ```
    docker compose build
    ```
4. Start the server
    ```
    docker compose up
    ```
To shutdown, navigate to second terminal in project directory and run.
    ```
    docker compose down
    ```
## Usage 
Once server is running, use your prefered API test tool. 
If using VSCode Rest Client, you can navigate to test.rest for preconfigured requests.

## Endpoints
    POST   /signup - Generates hashed password and returns it for testing
    POST   /login  - Compares password with "db" hash, generates JWT if valid
    DELETE /logout - Deletes REFRESH JWT from "db"
    POST   /token  - Issues new ACCESS JWT after verifying REFRESH JWT from "db"
    GET    /post   - Returns post that matches user

## Intended Flow
1. Login with test creds in test.rest and save REFRESH TOKEN
2. POST REFRESH TOKEN at /token to get new ACCESS TOKEN
3. Put ACCESS TOKEN in authorization header to get user post
4. Wait for 1m, /post should now be forbidden as ACCESS TOKEN has expired
4. POST REFRESH TOKEN at /logout to revoke JWT
5. Attempt to get new ACCESS TOKEN at /token, should be forbidden
