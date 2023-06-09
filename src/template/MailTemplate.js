const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sundararajan@xponential.digital',
        pass: process.env.MAILPASS
    }
});

function SignUpMail(receiverMail, otp) {
    const mailOptions = {
        from: 'sundararajan@xponential.digital',
        to: receiverMail,
        subject: 'Whatsapp Account Created',
        text: `Your OTP is : ${otp}`

    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            res.status(400).json(response.structure(null, `${error}`, 400));
        }
        else {
            res.status(200).json(response.structure(info.response, "Mail sent successfully", 200));
        }
    });
};

function InviteMail(receiverMail) {
    const mailOptions = {
        from: 'sundararajan@xponential.digital',
        to: receiverMail,
        subject: "You are Not in Whatsapp!! Download Whatsapp Now!!",
        text: `Let's chat on WhatsApp! It's a fast, simple, and secure app we can use to message and call each other for free. Get it at https://whatsapp.com/dl/`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error)
        }
        else {
            console.log("Mail sent successfully" + info.response)
        }
    });
};

module.exports = { SignUpMail, InviteMail }