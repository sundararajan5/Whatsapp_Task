const express = require('express');
const app = express();
app.use(express.json())
const users = require("./routes/users")
app.use("/user",users)


app.listen(5000,()=>{
    console.log("Server Running")
})