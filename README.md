# RESTful chat app

This chat app uses a RESTful Nodejs backend to create chat rooms where clients can communicate.

**Authors:**
- Adrian Tokle Storset, sXXXXXX
- Erik Storås Sommer, sXXXXXX,
- Mats Sommervold, s341829

<br>

## How to run

**Server:**

Development mode:
- Runs on port `5000` (or port assigned by environment variable `PORT`)
- Prints debug messages to the console
- Restarts the server whenever a project file is saved
- Uses an in-memory store for easier testing

To run the server in development mode:
```
cd server
npm i
npm run dev
```

<br>

Production mode:
- Runs on port `8080` (or port assigned by environment variable `PORT`)
- Does not print debug messages
- Uses a persistant file system storage option

To run server in production mode:
```
cd server
npm i
npm run start
```

*NB:* Make sure you are using the LTS version of node: `v14.16.0`.

<br>

**Client:**

Instructions will come

<br>

## API refrence

Here you will find a list of every endpoint the chat api exposes and how to use each one

<br>

### Users
`GET` - `/api/users` - Returns a list of userID's and the corresponding username

<br>

`POST` - `/api/users` - Creates a new user and returns a userID

Required fields:
 
*Header:* 

```
Content-Type : application/json
```

*Body:*

```json
{
    "username" : "%username%",
    "password" : "%password%"
}
```

<br>

`DELETE` - `/api/users` - Deletes a user

*Header:* 

```
Content-Type : application/json
Token : "%Auth Token%"
```

<br>