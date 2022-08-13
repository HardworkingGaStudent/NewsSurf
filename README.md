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

| Route Name | Path                                  | HTTP Verb | Action                                |
| ---------- | ------------------------------------- | --------- | ------------------------------------- |
| New        | /users/register                       | GET       | Show a new registration form          |
| Create     | /users/register                       | POST      | Register new user                     |
| New        | /users/login                          | GET       | Show a new login form                 |
| Create     | /users/login                          | POST      | Create a login session                |
| Destroy    | /users/logout                         | DELETE    | Destroys the current session          |
| New        | /users/profile                        | GET       | Shows update credentials form         |
| Update     | /users/profile                        | PUT       | Updates user credentials              |
| Index      | /users/dashboard                      | GET       | Lists all user articles               |
| New        | /articles/create-new-article          | GET       | Shows create a new article            |
| Create     | /articles/create-new-article          | POST      | Creates a new article, then redirects |
| Show       | /articles/articleid/:articleId        | GET       | Show info about a specific article    |
| Destroy    | /articles/articleid/:articleId/delete | DELETE    | Deletes a specific article            |
| Index      | /articles/genre/:genre                | GET       | Lists all articles by a certain genre |

## Schema

![Image](./db/Schema.drawio.png "icon")

## How to start MongoDB

`sudo mongod --dbpath ~/data/db` <br>
`mongo`

# Stack

- MongoDB
- Express
- EJS
- NodeJS
