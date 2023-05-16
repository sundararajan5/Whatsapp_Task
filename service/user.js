const Users = require("../model/user");
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer')
const otpGenerator = require('otp-generator')
const otp = require('generate-password');
const { symbol, string } = require("joi");

let otp_Mail;
let userdetails = {}

function structure(data, message, status) {
    return { status, message, data }
}
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sundararajan@xponential.digital',
        pass: 'fuoefbkbkblkasgr'
    }
});

function mailsent(receiverMail, otp) {
    const mailOptions = {
        from: 'sundararajan@xponential.digital',
        to: receiverMail,
        subject: 'Whatsapp Account Created',
        text: `Your OTP is : ${otp}`

    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error)
        }
        else {
            console.log("Mail sent successfully" + info.response)
        }
    });
}



const accountSid = process.env.AC_SID;
const authToken = process.env.Auth_Token;
const client = require('twilio')(accountSid, authToken);

client.messages.create({
     body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
     from: '+12707166899',
     to: '+919788390608'
   }).then(message => console.log(message.sid));




const addUser = async (req, res) => {
    try {
        userdetails = req.body
        otp_Mail = otpGenerator.generate(6, { digits: true, specialChars: false, lowerCaseAlphabets: false, upperCaseAlphabets: false });
        mailsent(userdetails.email, otp_Mail)
        res.status(200).json(structure(userdetails, "Verification Mail Sent sucessfully", 200))
    }
    catch (err) {
        console.log("error" + err)
        res.status(400).json(structure("" + err, "", 400))
    }
}


const verification = async (req, res) => {
    console.log(userdetails)
    const pass = await bcrypt.hash(userdetails.password, 5)
    userdetails.password = pass
    if (otp_Mail == req.body.otp) {
        try {
            const userDetails = await Users.query().insert(userdetails)
            res.status(200).json(structure(userDetails, "Your Account Verified Successfully"))
        }
        catch(err){
            res.status(400).json(structure(null,""+err,400))
        }
        
    }
    else {
        res.status(200).json(structure(null, "Otp Is Incorrect"))
    }

}


const updateUser = async (req, res) => {
    try {
        if (req.body.password) {
            const pass = await bcrypt.hash(req.body.password, 5)
            req.body.password = pass
        }
        if (req.body.role) {
            return res.status(200).json(structure(null, "You Cannot change Role", 404))
        }
        const updateDetails = await Users.query().findById(req.body.id).update(req.body);
        res.status(200).json(structure(req.body, "Profile Updated", 200))
    }
    catch (err) {
        res.status(400).json(structure("" + err, "error", 400))
    }
}


const getAllusers = async (req, res) => {
    try {
        const getAll = await Users.query().select('name', 'email', 'role', 'phonenumber').where('role', 'user')
        res.status(200).json(structure(getAll, "List of All userDetails", 200))
    }
    catch (err) {
        res.status(400).json(structure("" + err, "userDetails couldn't Fetch", 400))
    }
}






module.exports = { addUser, updateUser, getAllusers, verification }