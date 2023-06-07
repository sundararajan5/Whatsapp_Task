const express = require('express');
const router = express.Router();

const validation = require("../service/JoiValidation")
const chatservice = require('../service/chat')
const auth = require('../auth/auth.js')

router.post('/sendchat',validation.chatValidation,auth.authUser, chatservice.sendChat)
router.post('/rplychat', auth.authUser, chatservice.rplyChat)
router.post('/sendImg/:id', auth.authUser, chatservice.sentImg)
router.delete('/dltchat/:id', auth.authUser, chatservice.dltchat)
router.put('/dltTime', auth.authAdmin, chatservice.diff)
router.get('/getChat/:id', auth.authUser, chatservice.getChatMsg)
router.post('/sendStatus', auth.authUser, chatservice.sentStatus)
router.delete('/dltStatus/:id', chatservice.dltstatus)

module.exports = { router }