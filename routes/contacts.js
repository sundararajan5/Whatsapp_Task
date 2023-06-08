const express = require('express');
const router = express.Router();

const validation = require("../service/JoiValidation");
const auth = require('../auth/auth.js');
const contactService = require("../service/contacts.js");

router.post('/addcontacts',validation.contactValidation,auth.authUser, contactService.addContacts);
router.get('/myList',auth.authUser, contactService.getById);
router.put('/block',validation.updtContactValidation ,auth.authUser,contactService.blkContact);

module.exports={router}