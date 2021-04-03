# RESTful chat app

This chat app uses a RESTful Nodejs backend to create chat rooms where clients can communicate.

**Authors:**
- Adrian Tokle Storset, s341859
- Erik Storås Sommer, s341870
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

<br>

**Client:**

Development mode:
- Connects to host `localhost` (or host assigned by environment variable `HOST`)
- Connects to port `5000` (or port assigned by environment variable `PORT`)
- Prints debug messages to the console
- Restarts the client whenever a client file is saved

To run the client in development mode:
```
cd client
npm i
npm run dev
```

<br>

Production mode:
- Connects to host `localhost` (or host assigned by environment variable `HOST`)
- Connects to port `8080` (or port assigned by environment variable `PORT`)
- Does not print debug messages

To run server in production mode:
```
cd client
npm i
npm run start
```

*NB:* Make sure you are using the LTS version of node: `v14.16.0`.

<br>


## API refrence

Here you will find a list of every endpoint the chat api exposes and how to use each one

<br>

### `POST - /api/users`

Creates a new user and returns a userID
 
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

*Response body:*
```json
{
    "message" : "User created"
}
```

<br>

### `GET - /api/users`

Returns a list of all users

*Header:* 

```
Token : "%Auth Token%"
```

*Response body:*
```json
{
    "users" : [
        {
            "id" : "%userID%",
            "username" : "%username%"
        }
    ]
}
```

<br>

### `GET - /api/users/:userID`

Returns a user

*Header:* 

```
Token : "%Auth Token%"
```

*Response body:*
```json
{
    "user" : {
        "username" : "%username%",
        "id" : "%userID%",
        "ownedRooms" : [ "%roomID%" ],
        "rooms" : [ "%roomID%" ]
    }
}
```

<br>

### `DELETE - /api/users/:userID`

Deletes a user specified by the userID

*Header:* 

```
Token : "%Auth Token%"
```

*Response body:*
```json
{
    "message" : "User deleted"
}
```

<br>

### `POST - /api/tokens`

Authenticates user, establishes connection and returns a new tokenID
 
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

*Response body:*
```json
{
    "token" : "%tokenID",
    "message" : "Logged in"
}
```

<br>

### `GET - /api/tokens/:tokenID`

Returns token

*Header:* 

```
Token : "%Auth Token%"
```

*Response body:*
```json
{
    "token" : {
        "id": "%tokenID%",
        "username": "%username%",
        "expires": "%expiration date%"
    }
}
```

<br>

### `PUT - /api/tokens/:tokenID`

Extends token

*Header:* 

```
Token : "%Auth Token%"
```

*Response body:*
```json
{
    "message" : "Session extended"
}
```

<br>

### `DELETE - /api/tokens/:tokenID`

Deletes and invalidates token

*Header:* 

```
Token : "%Auth Token%"
```


*Response body:*
```json
{
    "message" : "Logged out"
}
```

<br>

### `POST - /api/rooms`

Creates a chat room

*Header:*

```
Token: %tokenID%
```

*Body:*

```json
{
    "name" : "%room name%"
}
```

*Response body:*
```json
{
    "message" : "Room created"
}
```

<br>

### `GET - /api/rooms`

Gets all chat rooms

*Header:* 

```
Token : "%Auth Token%"
```

*Response body:*
```json
{
    "rooms" : [
        {
            "id" : "%roomID%",
            "name" : "%room name%"
        }
    ]
}
```

<br>

### `GET - /api/rooms/:roomID`

Get room

*Header:* 

```
Token : "%Auth Token%"
```

<br>

### `DELETE - /api/rooms/:roomID`

Delete room

*Header:*

```
Token : %tokenID%
```

*Response body:*
```json
{
    "message" : "Room deleted"
}
```

<br>

### `POST - /api/rooms/:roomID/users`

Add user to room

*Header:*
```
Token : %tokenID%
```

*Body:*

```json
{
    "user" : "%userID%",
}
```

*Response body:*
```json
{
    "message" : "Added user to room"
}
```

<br>

### `GET - /api/rooms/:roomID/users`

Get all users in room

*Header:* 

```
Token : "%Auth Token%"
```

*Response body:*
```json
{
    "users" : [
        {
            "id" : "%userID%",
            "username" : "%username%"
        }
    ]
}
```

<br>

### `GET - /api/rooms/:roomID/messages`

Get all messages in room

*Header:*
```
Token : %tokenID%
```

*Response body:*
```json
{
    "messages" : [
        {
            "id" : "%messageID%",
            "message" : "%message%",
            "author" : "%userID%",
            "time" : "%time sent%"
        }
    ]
}
```

<br>

### `GET - /api/rooms/:roomID/:userID/messages`

Get all messages by user in room

*Header:*
```
Token : %tokenID%
```

*Response body:*
```json
{
    "messages" : [
        {
            "id" : "%messageID%",
            "message" : "%message%",
            "author" : "%userID%",
            "time" : "%time sent%"
        }
    ]
}
```

<br>

### `POST - /api/rooms/:roomID/:userID/messages`

Add message to room

*Header:*
```
Token : %tokenID%
```

*Body:*

```json
{
    "message" : "%message%"
}
```

*Response body:*
```json
{
    "message" : "Message sent"
}
```
