const express = require('express');
const app = express.Router();
app.use(express.json());
const users = require("./users");
const chats = require("./chat");
const contacts= require("./contacts");
app.use(express.json());



app.use("/api/v1/user",users.router);
app.use("/api/v1/msg",chats.router);
app.use('/api/v1/contact',contacts.router);


module.exports ={app};