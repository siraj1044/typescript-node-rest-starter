# TypeScript REST Node Starter

This repository can be used as a convenient starting point for building
`NODE REST API`'s using `TypeScript` on top of `Express` web framework.  

# Features
 - Basic `JWT` authentication and account activation using `SMTP`
 - Repository pattern used to enable separation of concerns
 - `MongoDB` - default repository implementation, should be easy to replace
 
# Pre-reqs
- Install [Node.js](https://nodejs.org/en/)
- Install [MongoDB](https://docs.mongodb.com/manual/installation/)
- Configure your SMTP service and enter your SMTP settings inside `.env.example`

# Getting started
- Clone the repository
```
git clone --depth=1 https://github.com/maljukan/typescript-node-rest-starter.git <project_name>
```
- Install dependencies
```
cd <project_name>
npm install
```
- Configure your mongoDB server
```
# create the db directory
sudo mkdir -p /data/db
# give the db correct read/write permissions
sudo chmod 777 /data/db
```
- Start your mongoDB server (you'll probably want another command prompt)
```
mongod
```
- Build and run the project
```
npm run build
npm start
```

# Swagger
To access Swagger UI for available endpoints
```
http://localhost:3000/api-docs/#/
```
Pass token from `/auth/login` when using protected endpoints (for example: getting all `/users`) like `Bearer <token>`

# REST endpoints
- public: `/auth/login`, `/auth/register`, `/auth/activate`
- protected: `/users`

# CURL
- Register
```
curl -d '{"email":"jdoe@example.com", "password":"PASSWORD", "lname": "Doe", "fname": "John", "role": "guest", "username": "jdoe"}' -H "Content-Type: application/json" -X POST http://localhost:3000/auth/register
```
- Activation
```
curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET http://localhost:3000/auth/activate/ACTIVATION_TOKEN
```
- Login
```
curl -i -d '{"email":"jdoe@example.com", "password":"PASSWORD"}' -H "Content-Type: application/json" -X POST http://localhost:3000/auth/login
```
- GET /users
```
curl -i -H "Accept: application/json" -H "Content-Type: application/json" -H "Authorization: Bearer JWT_TOKEN_HERE" -X GET http://localhost:3000/users/
```

# Import mock users
```
mongoimport --db heroes-db --collection users --file users.json --jsonArray
```

# TODO
- Implement RBAC functionality
- ~~Integrate Swagger~~
- Test coverage

# Credits
The repository is based on [Microsoft/TypeScript-Node-Starter
](https://github.com/Microsoft/TypeScript-Node-Starter)