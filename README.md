# RESTful chat app

This chat app uses a RESTful Nodejs backend to create chat rooms where clients can communicate.

**Authors:**
- Adrian Tokle Storset, s341859
- Erik Storås Sommer, s341870,
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

`POST - /api/users` - Creates a new user and returns a userID
 
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

`GET - /api/users` - Returns a list of userID's and the corresponding username

<br>

`DELETE - /api/users/:userID` - Deletes a user specified by the userID

*Header:* 

```
Token : "%Auth Token%"
```

<br>

### Tokens

`POST - /api/tokens` - Authenticates user, establishes connection and returns a new tokenID
 
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

`GET` - `/api/tokens/:tokenID` - Returns token in json format

*Response body:*
```json
{
    "id": "%tokenID%",
    "username": "%username%",
    "expires": "%expiration date%"
}
```

<br>

`PUT - /api/tokens/:tokenID` - Extends token

<br>

`DELETE - /api/tokens/:tokenID` - Deletes and invalidates token

<br>

### Rooms

`POST - /api/rooms` - Creates a chat room

*Header:*

```
Token: %tokenID%
```

<br>

`GET - /api/rooms` - Gets all chat rooms

<br>

`GET - /api/rooms/:roomID` - Get room

<br>

`DELETE - /api/rooms/:roomID` - Delete room

*Header:*

```
Token : %tokenID%
```

<br>

`POST - /api/rooms/:roomID/users` - Add user to room

*Header:*
```
Token : %tokenID%
```

<br>

`GET - /api/rooms/:roomID/users` - Get all users in room

<br>

`GET - /api/rooms/:roomID/messages` - Get all messages in room

*Header:*
```
Token : %tokenID%
```

`GET - /api/rooms/:roomID/:userID/messages` - Get all messages by user in room

*Header:*
```
Token : %tokenID%
```

`POST - /api/rooms/:roomID/:userID/messages` - Add message to room

*Header:*
```
Token : %tokenID%
```
