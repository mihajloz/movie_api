# Cinemate Server-Side Web Application

This project aims to create the backend component of a "movies" web application that provides users with access to information about different movies, directors, and genres. Users will be able to view information about movies, sign up, update their personal information, and create a list of their favorite movies.

## Objective

The objective of this project is to build the server-side component of the myFlix web application. This component will be responsible for handling user requests, processing data, interacting with the database, and providing the necessary information to the client-side of the application.

## Tech Stack

The technology stack for this project is based on the MERN (MongoDB, Express, React, Node.js) stack:

- **Node.js and Express:** The API is developed using Node.js and the Express framework to handle HTTP requests and responses.

- **MongoDB:** The database for storing movie, director, and user information is implemented using MongoDB, a NoSQL database.

## Features

The Cinemate server-side web application will implement the following features:

- Return a list of ALL movies to the user.
- Return data about a single movie by title, including description, genre, director, image URL, and whether it's featured or not.
- Return data about a genre by name, including its description.
- Return data about a director by name, including their bio, birth year, and death year.
- Allow new users to register by creating an account.
- Allow users to update their user information, such as username, password, email, and date of birth.
- Allow users to add movies to their list of favorite movies.
- Allow users to remove movies from their list of favorite movies.
- Allow existing users to deregister and delete their accounts.

## Technical Requirements

The Cinemate server-side web application has been developed to meet the project's goals and functionality. The following technical requirements have been successfully implemented:

- The API has been developed using Node.js and Express.
- The API follows REST architecture with URL endpoints for different data operations.
- Middleware modules like `body-parser` and `morgan` have been used.
- A `package.json` file has been included to manage dependencies.
- The database has been implemented using MongoDB, and Mongoose was used for modeling the business logic.
- Movie information is provided in JSON format.
- The API includes user authentication and authorization code.
- Data validation logic has been implemented to ensure the integrity of data.
- Data security regulations have been adhered to.
- The API source code has been deployed to GitHub and Heroku for public accessibility.

## Usage

To use the myFlix server-side web application, follow these steps:

1. Clone the repository to your local machine.
2. Install the required dependencies using `npm install`.
3. Set up your MongoDB database and update the connection details in the code.
4. Run the server using `npm start`.
5. Access the API endpoints using tools like Postman or integrate them into your client-side application.
