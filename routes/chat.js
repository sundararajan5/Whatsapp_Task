const express = require('express');
const router = express.Router();
const chatservice = require('../service/chat')
const auth = require('../auth/auth.js')

router.post('/sendchat',auth.authUser, chatservice.sendChat)
router.post('/sendImg',auth.authUser,chatservice.sentImg)
router.delete('/dltchat/:id', chatservice.dltchat)
router.post('/dltTime',auth.authAdmin,chatservice.diff)
router.get('/getChat/:id',auth.authUser,chatservice.getChatMsg)
router.post('/sendStatus',auth.authUser,chatservice.sentStatus)
router.delete('/dltStatus/:id',chatservice.dltstatus)

module.exports = { router }