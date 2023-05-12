const Chat = require('../model/chats')
const ChatFiles = require('../model/chatfiles')
const SendStatus = require('../model/status')
const nodemailer = require('nodemailer')
const path = require('path');
const multer = require('multer');
const timediff = require('timediff');
const { date } = require('joi');
const Contact = require('../model/contact')


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
    res.status(200).json(structure(null,"Delete Time will changed to "+deleteTime,200))
}


let statusTime =1
const statusdiff = async (req, res) => {
    statusTime = req.body.time
    res.status(200).json(structure(null,"Status Delete Time will changed to "+statusTime,200))
}

const rplyChat = async(req,res)=>{
    try{
        const id = await Contact.query().findOne({ id: req.body.receiver_id })
        if (id.status == 'Blocked') {
            return res.status(200).json(structure(null,"You Blocked this Person So you cant send message",200))
        }
        if (id.reg == 'Invite') {
            mailsent(id.email)
            return res.status(200).json(structure(null,"He is not in Whatsapp!! Invite Mail sent!",200))
        }
        let info = {
            sender_id: req.id,
            receiver_id: req.body.receiver_id,
            sentTime: new Date(),
            chat_message: req.body.chat_message,
            chat_reply_id:req.body.chat_reply_id,
            chat_Medianame: ''
        }
        const rplychat = await Chat.query().insert(info)
        res.status(200).json(structure(rplychat,"Reply message Sent",200))
    }
    catch(err){
        res.status(400).json(structure(null,""+err,400))
    }
}

const sendChat = async (req, res) => {
    try {

        const id = await Contact.query().findOne({ id: req.body.receiver_id })
        if (id.status == 'Blocked') {
            return res.status(200).json(structure(null,"You Blocked this Person So you cant send message",200))
        }
        if (id.reg == 'Invite') {
            mailsent(id.email)
            return res.status(200).json(structure(null,"He is not in Whatsapp!! Invite Mail sent!",200))
        }
        let info = {
            sender_id: req.id,
            receiver_id: req.body.receiver_id,
            sentTime: new Date(),
            chat_message: req.body.chat_message,
            chat_reply_id:null,
            chat_Medianame: ''
        }
        const chat = await Chat.query().insert(info)
        res.status(200).json(structure(chat,"Message Sent Successfully",200))
    }
    catch (err) {
        res.status(400).json(structure(null,""+err,400))
    }
}


const dltchat = async (req, res) => {

    try {
        const chatDetail = await Chat.query().findById(req.params.id)
        const time = timediff(chatDetail.sentTime, new Date(), 'H')
        console.log(time.hours);
        console.log(deleteTime)
        if ((time.hours) >= deleteTime) {
            res.status(400).json(structure(null,"You can't Delete this message!!",400))
        }
        else {
            try {
                const dltProd = await Chat.query().delete().where({ id: req.params.id })
                res.status(200).send({ status: 200, message: "Message Deleted Successfully" });
            }
            catch {
                res.status(400).json(structure(null,"Message not Deleted",400)) 
            }

        }
    } catch (err) {
        res.status(404).json(structure(null,"Cannot find User - ",400))
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
        cb(null, name+ new Date().toISOString().replace(/:/g, "-") + path.extname(file.originalname));
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
        callb(structure(null,"Uploaded file not similar to JPEG,JPG PNG,PDF",404))
    }
}).single('myimage')

let chat_sender;
const sentImg = async (req, res) => {
    try{ 
        name = req.user
        chat_sender = req.id
        console.log(chat_sender)
        upload(req, res, async function (err) {
            if (err) {
                res.send(err);
            }
            else {
                try{
                    req.body.chat_message = "media"
                req.body.chat_MediaName = name + new Date() + extn
                req.body.sender_id = chat_sender
                req.body.sentTime = new Date()
                rec_id = Number(req.params.id)
                req.body.receiver_id = rec_id
                let fileDetails = req.body
                console.log(fileDetails)
                let filesUploads = await Chat.query().insert(fileDetails)
                res.status(200).json(structure(fileDetails,"Media Sent SuccessFully",200))

                }
                catch(err){
                    res.status(400).json(structure(null,""+err,400))
                }
                
            }
        })}
        catch(err){
            res.status(400).json(structure(null,""+err,400))
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

        callb(structure(null,"Uploaded file not similar to JPEG,JPG PNG,PDF",404))
    }
}).single('myStatusImage')


const sentStatus = async(req, res) => {
    statusname = req.user
    auth_userid = req.id
    console.log(auth_userid)
    console.log(statusname)
    upload2(req, res, async function (err) {
        if(err){
            res.send(err);
        }
        else{
            try{
                req.body.status_File_Name = statusname+status_extn
            req.body.sent_status_Time = new Date()
            req.body.user_id = auth_userid
            let fileDetails = req.body
            filesUpload = await SendStatus.query().insert(fileDetails)
            res.status(200).json(structure(null,"Status updated SuccessFully",200))

            }
            catch(err){
                res.status(400).json(structure(null,""+err,400))
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
        console.log(statusTime)
        if ((time1.hours)>=statusTime) {
            try {
                const dltProd = await SendStatus.query().delete().where({ id: req.params.id })
                res.status(200).json(structure(null,"Status Deleted Successfully",200))
            }
            catch {
                res.status(404).json(structure(null,"Status not Deleted" +err,404))
            }

        }
        else{
            res.status(400).json(structure(null,"24 Hours not completed",400))
        }
    } catch (err) {
        res.status(404).json(structure(null,""+ err,404))
    }
}

const getChatMsg = async (req, res) => {
    try {

        const contacts = await Chat.query().select('chats.chat_message', 'contacts.name').joinRelated(Contact).leftJoin('contacts', 'chats.receiver_id', 'contacts.id').where('sender_id', req.id).where('receiver_id', req.params.id).orWhere('sender_id', req.params.id).where('receiver_id', req.id)
        res.status(200).json(structure(contacts,"Chat messages",200))
    }
    catch (err) {
        res.status(404).json(structure(null,"" + err,404))
    }

}



module.exports = { sendChat, dltchat, sentImg, diff, getChatMsg, sentStatus, dltstatus ,rplyChat , statusdiff}