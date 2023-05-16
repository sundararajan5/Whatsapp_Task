const Chat = require('../model/chats')
const Dlt = require('../model/dltTiming')
const SendStatus = require('../model/status')
const nodemailer = require('nodemailer')
const path = require('path');
const multer = require('multer');
const timediff = require('timediff');
const { date } = require('joi');
const Contact = require('../model/contact');
const Users = require('../model/user');
const { log } = require('console');


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

function mailsent(receiverMail) {
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
}





const diff = async (req, res) => {
    try {
        let info = {
            StatusDltTime: req.body.StatusDltTime,
            ChatDltTime: req.body.ChatDltTime
        }
        const changeTime = await Dlt.query().findById(1).update(info)
        res.status(200).json(structure(null, "Delete Time will changed ", 200))
    }
    catch (err) {
        return res.status(400).json(structure(null, "" + err, 400))
    }

}


const rplyChat = async (req, res) => {
    try {
        const user = await Users.query().findById(req.body.receiver_id)
        if (!user) {
            return res.send("User not exist")
        }
        const id1 = await Contact.query().findOne({ reg_user_id: req.id, phonenumber: user.phonenumber })
        console.log("---------------------------------------");
        console.log(user);
        console.log("---------------------------------------");
        console.log(id1)

        const cnt = await Chat.query().findOne({ id: req.body.chat_reply_id })
        console.log("---------------------------------------");
        console.log(cnt);
        if (!((cnt.sender_id == req.id && cnt.receiver_id == req.body.receiver_id) || (cnt.sender_id == req.body.receiver_id && cnt.receiver_id == req.id))) {
            return res.send("this not your chat reply")
        }
        if (id1 == null) {
            return res.send("He/she not your Contact")
        }
        // const id = await Contact.query().findOne({ id: req.body.receiver_id })
        if (id1.status == 'Blocked') {
            return res.status(200).json(structure(null, "You Blocked this Person So you cant send message", 200))
        }
        if (id1.reg == 'Invite') {
            mailsent(id1.email)
            return res.status(200).json(structure(null, "He is not in Whatsapp!! Invite Mail sent!", 200))
        }
        let info = {
            sender_id: req.id,
            receiver_id: req.body.receiver_id,
            sentTime: new Date(),
            chat_message: req.body.chat_message,
            chat_reply_id: req.body.chat_reply_id,
            chat_Medianame: ''
        }
        const rplychat = await Chat.query().insert(info)
        res.status(200).json(structure(rplychat, "Reply message Sent", 200))
    }
    catch (err) {
        res.status(400).json(structure(null, "" + err, 400))
    }
}

const sendChat = async (req, res) => {
    try {
        const user = await Users.query().findById(req.body.receiver_id)
        if (!user) {
            return res.send("User not exist")
        }
        const id1 = await Contact.query().findOne({ reg_user_id: req.id, phonenumber: user.phonenumber })
        console.log("---------------------------------------");
        console.log(user);
        console.log("---------------------------------------");
        console.log(id1)
        if (id1 == null) {
            return res.send("He/she not your Contact")
        }
        // const id = await Contact.query().findOne({ id: req.body.receiver_id })
        if (id1.status == 'Blocked') {
            return res.status(200).json(structure(null, "You Blocked this Person So you cant send message", 200))
        }
        if (id1.reg == 'Invite') {
            mailsent(id1.email)
            return res.status(200).json(structure(null, "He is not in Whatsapp!! Invite Mail sent!", 200))
        }


        let info = {
            sender_id: req.id,
            receiver_id: req.body.receiver_id,
            sentTime: new Date(),
            chat_message: req.body.chat_message,
            chat_reply_id: null,
            chat_Medianame: ''
        }
        const chat = await Chat.query().insert(info)
        res.status(200).json(structure(chat, "Message Sent Successfully", 200))
    }
    catch (err) {
        res.status(400).json(structure(null, "" + err, 400))
    }
}


const dltchat = async (req, res) => {

    try {
        const reqParams = Number(req.params.id)
        const cnt = await Chat.query().findOne({ id: reqParams })
        console.log(cnt);
        if (!((cnt.sender_id == req.id && cnt.receiver_id == req.body.receiver_id) || (cnt.sender_id == req.body.receiver_id && cnt.receiver_id == req.id))) {
            return res.send("this not your chat reply")
        }
        const chatDetail = await Chat.query().findById(req.params.id)
        const time = timediff(chatDetail.sentTime, new Date(), 'H')
        console.log(time.hours);
        const timing = await Dlt.query().findById(1)
        console.log(timing.ChatDltTime)
        if ((time.hours) >= timing.ChatDltTime) {
            res.status(400).json(structure(null, "You can't Delete this message!!", 400))
        }
        else {
            try {
                const sdf = { chat_reply_id: null }
                const adsf = await Chat.query().where('chat_reply_id', reqParams).update(sdf)
                const dltProd = await Chat.query().delete().where({ id: reqParams })
                res.status(200).send({ status: 200, message: "Message Deleted Successfully" });
            }
            catch (err) {
                res.status(400).json(structure(null, "Message not Deleted" + err, 400))
            }

        }
    } catch (err) {
        res.status(404).json(structure(null, "Cannot find User - " + err, 400))
    }
}


let statusname;
let name;
let extn;
let status_extn;
let auth_userid;

const storage = multer.diskStorage({
    destination: 'whatsappDocs',
    filename: function (req, file, cb) {
        cb(null, name + new Date().toISOString().replace(/:/g, "-") + path.extname(file.originalname));
        extn = path.extname(file.originalname)
    }
})
const maxSize = 100000 * 1000 * 1000;
const upload = multer({
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: function (req, file, callb) {
        const filetypes = /jpeg|jpg|png|pdf/;
        const mimetype = filetypes.test(file.mimetype);
        const extname1 = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname1) {
            return callb(null, true);
        }
        callb(structure(null, "Uploaded file not similar to JPEG,JPG PNG,PDF", 404))
    }
}).single('myimage')

let chat_sender;
const sentImg = async (req, res) => {
    try {
        name = req.user
        chat_sender = req.id
        console.log(chat_sender)
        upload(req, res, async function (err) {
            if (err) {
                res.send(err);
            }
            else {
                try {

                    const user = await Users.query().findById(req.params.id)
                    if (!user) {
                        return res.send("User not exist")
                    }
                    const id1 = await Contact.query().findOne({ reg_user_id: chat_sender, phonenumber: user.phonenumber })
                    console.log("---------------------------------------");
                    console.log(user);
                    console.log("---------------------------------------");
                    console.log(id1)
                    if (id1 == null) {
                        return res.send("He/she not your Contact")
                    }
                    req.body.chat_message = "media"
                    req.body.chat_MediaName = name + new Date() + extn
                    req.body.sender_id = chat_sender
                    req.body.sentTime = new Date()
                    req.body.receiver_id = Number(req.params.id)
                    let fileDetails = req.body
                    console.log(fileDetails)
                    let filesUploads = await Chat.query().insert(fileDetails)
                    res.status(200).json(structure(fileDetails, "Media Sent SuccessFully", 200))

                }
                catch (err) {
                    res.status(400).json(structure(null, "" + err, 400))
                }

            }
        })
    }
    catch (err) {
        res.status(400).json(structure(null, "" + err, 400))
    }

}


const storage2 = multer.diskStorage({
    destination: 'whatsappStatus',
    filename: function (req, file, cb) {
        cb(null, statusname + new Date().toISOString().replace(/:/g, "-") + path.extname(file.originalname));
        status_extn = path.extname(file.originalname)
    }
})


const upload2 = multer({
    storage: storage2,
    fileFilter: function (req, file, callb) {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname1 = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname1) {
            return callb(null, true);
        }

        callb(structure(null, "Uploaded file not similar to JPEG,JPG PNG,PDF", 404))
    }
}).single('myStatusImage')


const sentStatus = async (req, res) => {
    statusname = req.user
    auth_userid = req.id
    console.log(auth_userid)
    console.log(statusname)
    upload2(req, res, async function (err) {
        if (err) {
            res.send(err);
        }
        else {
            try {
                req.body.status_File_Name = statusname + status_extn
                req.body.sent_status_Time = new Date()
                req.body.user_id = auth_userid
                let fileDetails = req.body
                filesUpload = await SendStatus.query().insert(fileDetails)
                res.status(200).json(structure(null, "Status updated SuccessFully", 200))

            }
            catch (err) {
                res.status(400).json(structure(null, "" + err, 400))
            }

        }
    })
}


const dltstatus = async (req, res) => {
    try {
        const statusDetail = await SendStatus.query().findById(req.params.id)
        console.log(statusDetail.sent_Status_Time)
        const time1 = timediff(statusDetail.sent_Status_Time, new Date(), 'H')
        console.log(time1.hours);
        const timing = await Dlt.query().findById(1)
        console.log(timing.StatusDltTime)
        if ((time1.hours) >= timing.StatusDltTime) {
            try {
                const dltProd = await SendStatus.query().delete().where({ id: req.params.id })
                res.status(200).json(structure(null, "Status Deleted Successfully", 200))
            }
            catch {
                res.status(404).json(structure(null, "Status not Deleted" + err, 404))
            }

        }
        else {
            res.status(400).json(structure(null, "24 Hours not completed", 400))
        }
    } catch (err) {
        res.status(404).json(structure(null, "" + err, 404))
    }
}

const getChatMsg = async (req, res) => {
    try {

        const contacts = await Chat.query().select('chats.chat_message', 'user.name').joinRelated(Contact).leftJoin('user', 'chats.receiver_id', 'user.id').where('sender_id', req.id).where('receiver_id', req.params.id).orWhere('sender_id', req.params.id).where('receiver_id', req.id)
        // const contacts1 = await Chat.query().select('chats.chat_message', 'contacts.name').joinRelated().leftJoin('contacts', 'chats.receiver_id', 'user.id').where('sender_id', req.id).where('receiver_id', req.params.id).orWhere('sender_id', req.params.id).where('receiver_id', req.id)
        res.status(200).json(structure(contacts, "Chat messages", 200))
    }
    catch (err) {
        res.status(404).json(structure(null, "" + err, 404))
    }

}


module.exports = { sendChat, dltchat, sentImg, diff, getChatMsg, sentStatus, dltstatus, rplyChat }