const express = require('express');
const config = require('./config.js')

const PORT = config.port

const app = express();


app.get('/', (req, res)=> {
  res.send('Hello World');
}) 

app.listen(config.port,()=>{
 console.log(`starting server on ${config.port} in ${config.mode}`);
});