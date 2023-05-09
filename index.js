const express = require('express');
const app = express();
app.use(express.json())
const users = require("./routes/users")
const chats = require("./routes/chat")
app.use("/user",users)
app.use("/msg",chats.router)


app.listen(5000,()=>{
    console.log("Server Running")
})