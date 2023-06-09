const express = require('express');
const router = express.Router();
const validation = require("../controller/JoiValidation");
const auth = require('../auth/auth.js');
const userController = require("../controller/user.js");
const tokenService = require("../controller/token.js");

router.post('/login', tokenService.GenerateToken);
router.post('/signup',validation.creatvalidation, userController.addUser);
router.post('/otp', validation.verify, userController.verification);
router.put('/update',validation.creatvalidation, auth.authUser,userController.updateUser);
router.get('/getAll',auth.authAdmin,userController.getAllusers);

module.exports = {router};