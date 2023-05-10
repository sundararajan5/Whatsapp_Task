const express = require('express');
const router = express.Router();
const chatservice = require('../service/chat')
const auth = require('../auth/auth.js')

router.post('/sendchat', chatservice.sendChat)
router.post('/sendImg',auth.authUser, chatservice.sentImg)
router.delete('/dltchat/:id', chatservice.dltchat)
router.post('/dltTime',auth.authAdmin,chatservice.diff)

module.exports = { router }