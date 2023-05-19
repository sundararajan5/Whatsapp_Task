const express = require('express');
const router = express.Router();
const auth = require('../auth/auth.js')
const contactService = require("../service/contacts.js");

router.post('/addcontacts',auth.authUser, contactService.addContacts)
router.get('/myList',auth.authUser, contactService.getById)
router.put('/block', auth.authUser,contactService.blkContact)

module.exports={router}