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
- Uses an in-memory store

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
- Uses an in-memory store

To run server in production mode:
```
cd server
npm i
npm run start
```

<br>

**Client:**

Development mode:
- Connects to host `localhost`
- Connects to port `5000`
- Client server runs at port `5500`
- Prints debug messages to the console
- Restarts the client whenever a client file is saved

To run the client in development mode:
```
cd app
npm i
npm run dev
```

Now, open your browser at `localhost:5500` to interact with the client.

<br>

Production mode:
 - The client runs packaged with the server in production mode. Just go to the `/` route to get the client.
 - To run a second client at the same time, logged in as a different user, you have to run it in another browser or on another device as the client uses the `localStorage` api to keep logged when the browser is refreshed.

<br>

**Bots:**

The bots can be added to rooms from the client UI or you can start them individually from the terminal

Bots in the terminal:
- Connects to host `localhost` (or port assigned by environment variable `HOST`)
- Connects to port `8080` (or port assigned by environment variable `PORT`)
- Picks random username from a pool of names
- Will join the `bot` room or create one if it doesn't exist yet.
- Posts/responds to messages

To run a bot from the terminal:
```
HOST=localhost PORT=8080 node bot.js
```

Bots from UI:
- Go to the client in your browser. Log in and create a room and select it. Then add a bot to the room by the panel on the right hand side.

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

### `GET - /api/user/:userID`

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

### `DELETE - /api/user/:userID`

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

### `GET - /api/token/:tokenID`

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

### `PUT - /api/token/:tokenID`

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

### `DELETE - /api/token/:tokenID`

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

### `GET - /api/room/:roomID`

Get room

*Header:* 

```
Token : "%Auth Token%"
```

<br>

### `DELETE - /api/room/:roomID`

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

### `POST - /api/room/:roomID/users`

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

### `GET - /api/room/:roomID/users`

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

### `GET - /api/room/:roomID/messages`

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

### `GET - /api/room/:roomID/:userID/messages`

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

### `POST - /api/room/:roomID/:userID/messages`

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
