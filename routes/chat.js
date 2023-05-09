const express = require('express');
const router = express.Router();
const chatservice = require('../service/chat')

router.post('/sendchat',chatservice.sendChat)
router.delete('/dltchat/:id',chatservice.dltchat)

module.exports={router}