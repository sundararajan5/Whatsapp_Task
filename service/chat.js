const Chat = require('../model/chats')
const ChatFiles = require('../model/chatfiles')
const SendStatus = require('../model/status')
const nodemailer = require('nodemailer')
const path = require('path');
const multer = require('multer');
const timediff = require('timediff');
const { date } = require('joi');
const Contact = require('../model/contact')



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
        subject:"You are Not in Whatsapp!! Download Whatsapp Now!!"  ,    
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




let deleteTime = 1

const diff = async (req, res) => {
    deleteTime = req.body.time
    res.send("Deletion Time Update " + deleteTime)
}




const sendChat = async (req, res) => {
    try {

        const id = await Contact.query().findOne({ id: req.body.receiver_id })
        if (id.status == 'Blocked') {
            return res.send('you Blocked this Person So you cant send')
        }
        if (id.reg == 'Invite') {
            mailsent(id.email)
            return res.status(200).send("He is not in Whatsapp!! Invite Mail sent!")
        }
        let info = {
            sender_id: req.body.id,
            receiver_id: req.body.receiver_id,
            sentTime: new Date(),
            chat_message: req.body.chat_message,
            chat_reply_id:null,
            chat_Medianame: ''
        }
        const chat = await Chat.query().insert(info)
        res.send(chat);
    }
    catch (err) {
        res.send(err)
    }
}


const dltchat = async (req, res) => {

    try {
        const chatDetail = await Chat.query().findById(req.params.id)
        const time = timediff(chatDetail.sentTime, new Date(), 'H')
        console.log(time.hours);
        if ((time.hours) >= deleteTime) {
            res.status(404).send({ status: 404, message: "You can't Delete this message!!" });
        }
        else {
            try {
                const dltProd = await Chat.query().delete().where({ id: req.params.id })
                res.status(200).send({ status: 200, message: "Message Deleted Successfully" });
            }
            catch {
                res.status(404).send({ status: 404, message: "Message not Deleted" + err, data: null });
            }

        }

    } catch (err) {
        res.status(404).send({ status: 404, message: "Cannot find User - " + err, data: null });
    }
}


let statusname;
let name;
let extn;

const storage = multer.diskStorage({
    destination: 'whatsappDocs',
    filename: function (req, file, cb) {
        cb(null, "sundar" + new Date().toISOString().replace(/:/g, "-") + path.extname(file.originalname));
        extn = path.extname(file.originalname)
    }
})
const maxSize = 2 * 1000 * 1000;
const upload = multer({
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: function (req, file, callb) {
        const filetypes = /jpeg|jpg|png|pdf|/;
        const mimetype = filetypes.test(file.mimetype);
        const extname1 = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname1) {
            return callb(null, true);
        }
        callb("Uploaded file not similar to JPEG,JPG PNG,PDF")
    }
}).single('myimage')

let chat_sender;
const sentImg = async (req, res) => {
    name = req.body.user
    chat_sender = req.body.id
    console.log(chat_sender)
    upload(req, res, async function (err) {
        if (err) {
            res.send(err);
        }
        else {
            req.body.chat_message = "media"
            req.body.chat_MediaName = name + new Date() + extn
            req.body.sender_id = chat_sender
            req.body.sentTime = new Date()
            req.body.dltTime = new Date()

            let fileDetails = req.body
            let filesUploads = await Chat.query().insert(fileDetails)
            res.send('success')
        }
    })
}


const storage2 = multer.diskStorage({
    destination: 'uploads',
    filename: function (req, file, cb) {
        cb(null, statusname + new Date().toISOString().replace(/:/g, "-") + path.extname(file.originalname));
        extn = path.extname(file.originalname)
        console.log(extn)
    }
})


const upload2 = multer({
    storage: storage2,
    fileFilter: function (req, file, callb) {
        const filetypes = /jpeg|jpg|png|/;
        const mimetype = filetypes.test(file.mimetype);
        const extname1 = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname1) {
            return callb(null, true);
        }

        callb("Uploaded file not similar to JPEG,JPG PNG,PDF")
    }
}).single('myStatusImage')






const sentStatus = async(req, res) => {
    statusname = req.body.user
    console.log(statusname)
    upload2(req, res, async function (err) {
        if(err){
            res.send(err);
        }
        else{
            req.body.status_File_Name = statusname + extn
            req.body.sent_status_Time = new Date()
            let fileDetails = req.body
            filesUpload = await SendStatus.query().insert(fileDetails)
            res.send('success')
        }
    })
}


const dltstatus = async (req, res) => {
    try {
        const chatDetail = await SendStatus.query().findById(req.params.id)
        const time1 = timediff(chatDetail.sent_status_Time, new Date(), 'H')
        console.log(time1.hours);
        if ((time1.hours) == 24) {
            try {
                const dltProd = await SendStatus.query().delete().where({ id: req.params.id })
                res.status(200).send({ status: 200, message: "Status Deleted Successfully" });
            }
            catch {
                res.status(404).send({ status: 404, message: "Status not Deleted" + err, data: null });
            }

        }
        else{res.send("24 hours")}
    } catch (err) {
        res.status(404).send({ status: 404, message: "Cannot find User - " + err, data: null });
    }
}

const getChatMsg = async (req, res) => {
    try {
        const contacts = await Chat.query().select('chats.chat_message', 'contacts.name').joinRelated(Contact).leftJoin('contacts', 'chats.receiver_id', 'contacts.id').where('sender_id', req.body.id).where('receiver_id', req.params.id).orWhere('sender_id', req.params.id).where('receiver_id', req.body.id)
        res.send(contacts)
    }
    catch (err) {
        res.send(err)
    }

}



module.exports = { sendChat, dltchat, sentImg, diff, getChatMsg, sentStatus, dltstatus }