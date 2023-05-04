const Users = require("../model/user");
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer')
const otp = require('generate-password');
const { symbol } = require("joi");

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
  
  function mailsent(receiverMail,otp){
  const mailOptions = {
    from: 'sundararajan@xponential.digital',
    to: receiverMail,
    subject: 'Whatsapp Account Created',
    text: `Your OTP is : ${otp}`
    
  };

  transporter.sendMail(mailOptions,function(error,info){
    if(error){
        console.log(error)
    }
    else{
        console.log("Mail sent successfully" + info.response)
    }
  });
  }


const addUser = async (req, res) => {

    const pass = await bcrypt.hash(req.body.password, 5)
    try {
        req.body.password = pass
        let info = req.body


        const otp_new  = otp.generate({
            length:8,
        })

        
        const userDetails = await Users.query().insert(info)
        mailsent(req.body.email,otp_new)
        res.status(200).json(structure(userDetails, "signed in sucessfully", 200))

    }
    catch (err) {
        console.log("error" + err)
        res.status(400).json(structure("" + err, "", 400))
    }
}

const updateUser =  async (req, res) => {
    try{
        let paramsId = req.params.id
        const updateDetails = await Users.query().findById(paramsId).patch(req.body);
        res.status(200).json(structure(req.body,"Profile Updated",200))
    }
    catch(err){
        res.status(400).json(structure(""+err,"error",400))
    }
}

module.exports = { addUser,updateUser}