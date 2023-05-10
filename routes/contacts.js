const express = require('express');
const router = express.Router();
const auth = require('../auth/auth.js')
const contactService = require("../service/contacts.js");
const tokenService = require("../service/token.js")

router.post('/addcontacts', contactService.addContacts)
router.get('/contacts/:id', contactService.getById)
router.put('/block', contactService.blkContact)

module.exports=router