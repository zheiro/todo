<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest
  
  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">


# Todo App

Todo App is a simple CRUD application that is powered by NestJS that utilizes Firebase Realtime Database for cloud storage. 

Firebase serves as a NoSQL database for both storing data and session tokens for authentication.

## Getting Started

Make sure to install dependencies using `npm install`.

To run the application locally, use the following command:

`npm run start`

This will launch the app on localhost:3000.

## API Documentation

API documentation is available at:

http://localhost:3000/api

## Endpoints

### Register

Endpoint: /register

This endpoint allows users to register with their email and password to create an account in the system.

### Login

Endpoint: /login

Use this endpoint to authenticate by providing your email and password. You will receive a token that can be used as a bearer token for secure API access.

### Create a Todo Item

Endpoint: POST /todo

This endpoint allows users to create a new todo item by providing a title and an optional description.

### Get All Todo Items

Endpoint: GET /todo

Use this endpoint to fetch all todo items for the current user. The list is arranged by order.

### Get a Specific Todo Item

Endpoint: GET /todo/{id}

This endpoint retrieves a specific todo item based on its unique identifier (ID).

### Update a Todo Item

Endpoint: PATCH /todo/{id}

Use this endpoint to update the details of a todo item, including the title, description, and order.

### Delete a Todo Item

Endpoint: DELETE /todo/{id}

This endpoint allows users to remove a todo item from their list.

## License

  Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
