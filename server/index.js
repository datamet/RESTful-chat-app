const express = require('express');
const app = express();

const PORT = 5000 || process.env.PORT

app.get('/', (req, res)=> {
  res.send('Hello World');
}) 



app.listen(PORT,()=>{
 console.log(`starting server on ${PORT}`);
});