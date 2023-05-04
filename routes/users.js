const express = require('express');
const router = express.Router();
const auth = require('../auth/auth.js')
const userService = require("../service/user.js");
const tokenService = require("../service/token.js")

router.post('/login',tokenService.GenerateToken)
router.post('/signup',userService.addUser)
router.put('/update/:id',userService.updateUser)

module.exports = router