const bcrypt = require("bcrypt");
const otpGenerator = require('otp-generator');


const mailTemplate = require("../template/MailTemplate");
const userServ = require('../service/user')
const response = require('../HelperFile/helperfile')

let otp_Mail;


const addUser = async (req, res) => {
    try {
        otp_Mail = otpGenerator.generate(6, { digits: true, specialChars: false, lowerCaseAlphabets: false, upperCaseAlphabets: false });
        req.body.OTP = otp_Mail;
        const pass = bcrypt.hashSync(req.body.password, 5);
        req.body.password = pass;
        req.body.accountStatus = "Not Verified"
        let userdetails = req.body;
        const addUserData = await userServ.createUser(userdetails);
        mailTemplate.SignUpMail(userdetails.email, otp_Mail);
        res.status(200).json(response.structure(userdetails, "Verification Mail Sent sucessfully", 200));
    }
    catch (err) {
        res.status(400).json(response.structure(`${err}`, "", 400));
    }
}


const verification = async (req, res) => {
    try {
        let userData = {
            email: req.body.email,
            OTP: req.body.OTP
        }
        const userValue = await userServ.findUser({ email: req.body.email })
        if (userData.OTP == userValue.OTP) {
            req.body.accountStatus = "Verified"
            const verify = await userServ.updateUser({ email: userData.email }, req.body);
            res.status(200).json(response.structure(null, "Your Account Verified Successfully", 200));
        }
        else {
            res.status(200).json(response.structure(null, "OTP mismatch", 400));
        }
    }
    catch (err) {
        res.status(400).json(response.structure(`${err}`, "error", 400));
    }
}


const updateUser = async (req, res) => {
    try {
        if (req.body.password) {
            const pass = await bcrypt.hashSync(req.body.password, 5);
            req.body.password = pass;
        }
        if (req.body.role) {
            return res.status(200).json(response.structure(null, "You Cannot change Role", 404));
        }
        const updateDetails = await userServ.updateUser1(req.id, req.body);
        res.status(200).json(response.structure(req.body, "Profile Updated", 200));
    }
    catch (err) {
        res.status(400).json(response.structure(`${err}`, "error", 400));
    }
}


const getAllusers = async (req, res) => {
    try {
        const getAll = await userServ.getUser()
        res.status(200).json(response.structure(getAll, "List of All userDetails", 200));
    }
    catch (err) {
        res.status(400).json(response.structure(`${err}`, "userDetails couldn't Fetch", 400));
    }
}

module.exports = { addUser, updateUser, getAllusers, verification };