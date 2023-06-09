const express = require('express');
const router = express.Router();

const validation = require("../controller/JoiValidation");
const auth = require('../auth/auth.js');
const contactController = require("../controller/contacts.js");

router.post('/addcontacts',validation.contactValidation,auth.authUser, contactController.addContacts);
router.get('/myList',auth.authUser, contactController.getById);
router.put('/block',validation.updtContactValidation ,auth.authUser,contactController.blkContact);

module.exports={router}