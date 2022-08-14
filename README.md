# NewsSurf

A simple [web](https://newssurf.herokuapp.com/) community for people to share articles

## Features

- User:
  - Register
  - Login/Logout
  - Update Credentials
- Articles:
  - Upload article (with images)
  - Dashboard to view posts
  - Delete article (author-specific)

## Restful Routes

| HTTP verb | Path                                  | Action                                                 |
| --------- | ------------------------------------- | ------------------------------------------------------ |
| NEW       | /users/register                       | Returns a new registration form                        |
| NEW       | /users/login                          | Returns a new login form                               |
| NEW       | /articles/create-new-article          | Returns a new create articles form                     |
| EDIT      | /users/profile                        | Returns a form to edit user credentials                |
| EDIT      | /articles/articleid/:articleId/edit   | Returns a form to edit a particular article's contents |
| POST      | /users/register                       | Save the user's record in the users DB                 |
| POST      | /users/login                          | Creates a login session                                |
| POST      | /articles/create-new-article          | Saves article contents in DB                           |
| POST      | /articles/articleid/:articleId/edit   | Updates the article's contents in DB                   |
| PUT       | /users/profile                        | Updates user's record in the users DB                  |
| SHOW      | /users/dashboard                      | Lists all user's articles                              |
| SHOW      | /articles/genre/:genre                | Returns an array of articles by genre                  |
| GET       | /articles/articleid/:articleId        | Show info about a specific article                     |
| DELETE    | /users/logout                         | Destroys the current login session                     |
| DELETE    | /articles/articleid/:articleId/delete | Deletes a specific article from the DB                 |

## Schema

![Image](./db/Schema.drawio.png "icon")

## Improvements

- Consider `comments`, `likes`, `paywalls` features

## How to start MongoDB

`sudo mongod --dbpath ~/data/db` <br>
`mongo`

# Stack

- MongoDB
- Express
- EJS
- NodeJS
