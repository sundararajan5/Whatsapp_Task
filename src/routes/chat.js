const express = require('express');
const router = express.Router();

const validation = require("../controller/JoiValidation");
const chatController = require('../controller/chat');
const auth = require('../auth/auth.js');

router.post('/sendchat',validation.chatValidation,auth.authUser, chatController.sendChat);
router.post('/rplychat', validation.replyValidation, auth.authUser, chatController.rplyChat);
router.post('/sendImg/:id', auth.authUser, chatController.sentImg);
router.delete('/dltchat/:id', validation.dltchatVal, auth.authUser, chatController.dltchat);
router.put('/dltTime',validation.dltTimeValidation, auth.authAdmin, chatController.diff);
router.get('/getChat/:id', auth.authUser, chatController.getChatMsg);
router.post('/sendStatus', auth.authUser, chatController.sentStatus);
router.delete('/dltStatus/:id', chatController.dltstatus);

module.exports = { router }