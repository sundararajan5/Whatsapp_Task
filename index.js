const express = require('express');
const app = express();
const main = require('./src/routes/main');
app.use(express.json());
app.use(main.app);


app.listen(5000,()=>{
    console.log("Server Running")
})