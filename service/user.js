const bcrypt = require("bcrypt");
const otpGenerator = require('otp-generator');
const otp = require('generate-password');
const { symbol, string } = require("joi");

const Users = require("../model/user");
const mailTemplate = require("../template/MailTemplate");


let otp_Mail;
// let userdetails = {};

function structure(data, message, status) {
    return { status, message, data }
};


const addUser = async (req, res) => {
    try {
        otp_Mail = otpGenerator.generate(6, { digits: true, specialChars: false, lowerCaseAlphabets: false, upperCaseAlphabets: false });   
        req.body.OTP = otp_Mail;
        const pass = bcrypt.hashSync(req.body.password, 5);
        req.body.password = pass;
        req.body.accountStatus ="Not Verified"
        let userdetails = req.body;
        const addUserData = await Users.query().insert(userdetails);
        mailTemplate.SignUpMail(userdetails.email, otp_Mail);
        res.status(200).json(structure(userdetails, "Verification Mail Sent sucessfully", 200));
    }
    catch(err){
        res.status(400).json(structure(`${err}`, "", 400));
    }
}


const verification = async (req, res) => {
    try{

        let userData = {
            email:req.body.email,
            OTP: req.body.OTP
        }
    
        const userValue = await Users.query().findOne({
            email:req.body.email
        })
        if(userData.OTP == userValue.OTP){
            req.body.accountStatus="Verified"
            const verify = await Users.query().findOne({
                email:userData.email
            }).update(req.body);
    
            res.status(200).json(structure(null, "Your Account Verified Successfully",200));
        }
        else{
            res.status(200).json(structure(null, "OTP mismatch",400));
        }

    }
    catch(err){
        res.status(400).json(structure(`${err}`, "error", 400));
    }
   

}


const updateUser = async (req, res) => {
    try {
        if (req.body.password) {
            const pass = await bcrypt.hashSync(req.body.password, 5);
            req.body.password = pass;
        }
        if (req.body.role) {
            return res.status(200).json(structure(null, "You Cannot change Role", 404));
        }
        const updateDetails = await Users.query().findById(req.id).update(req.body);
        res.status(200).json(structure(req.body, "Profile Updated", 200));
    }
    catch (err) {
        res.status(400).json(structure(`${err}`, "error", 400));
    }
}


const getAllusers = async (req, res) => {
    try {
        const getAll = await Users.query().select('name', 'email', 'phonenumber').where('role', 'user');
        res.status(200).json(structure(getAll, "List of All userDetails", 200));
    }
    catch (err) {
        res.status(400).json(structure(`${err}`, "userDetails couldn't Fetch", 400));
    }
}

module.exports = { addUser, updateUser, getAllusers, verification };