const express = require('express');
const router = express.Router();
const validation = require("../service/JoiValidation")
const auth = require('../auth/auth.js')
const userService = require("../service/user.js");
const tokenService = require("../service/token.js")

router.post('/login', tokenService.GenerateToken)
router.post('/signup',validation.creatvalidation, userService.addUser)
router.post('/otp', userService.verification)
router.put('/update',auth.authUser,userService.updateUser)
router.get('/getAll',auth.authAdmin,userService.getAllusers)

module.exports = {router}