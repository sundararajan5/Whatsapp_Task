const express = require('express');
const app = express();
app.use(express.json())
const users = require("./routes/users")
const chats = require("./routes/chat")
const contacts= require("./routes/contacts")
app.use(express.json())
app.use("/user",users.router)
app.use("/msg",chats.router)
app.use('/contact',contacts.router)


app.listen(5000,()=>{
    console.log("Server Running")
})