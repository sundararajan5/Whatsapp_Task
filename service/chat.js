const path = require('path');
const multer = require('multer');
const timediff = require('timediff');
const { date } = require('joi');

const Chat = require('../model/chats');
const Dlt = require('../model/dltTiming');
const SendStatus = require('../model/status');
const mailTemplate = require("../template/MailTemplate");
const Contact = require('../model/contact');
const Users = require('../model/user');

let statusname;
let name;
let extn;
let status_extn;
let auth_userid;
let chat_sender;

function structure(data, message, status) {
    return { status, message, data }
};

const diff = async (req, res) => {
    try {
        let info = {
            StatusDltTime: req.body.StatusDltTime,
            ChatDltTime: req.body.ChatDltTime
        }
        const changeTime = await Dlt.query().findById(1).update(info);
        res.status(200).json(structure(null, "Delete Time will changed ", 200));
    }
    catch (err) {
        return res.status(400).json(structure(null, `${err}`, 400));
    }

}

const rplyChat = async (req, res) => {
    try {
        const user = await Users.query().findById(req.body.receiver_id);
        if (!user) {
            return res.status(400).json(structure(null, "User Not Exixts in your contact", 400));
        }
        const contactDetail = await Contact.query().findOne({ reg_user_id: req.id, phonenumber: user.phonenumber });
        const chatReply = await Chat.query().findOne({ id: req.body.chat_reply_id });

        if (!((chatReply.sender_id == req.id && chatReply.receiver_id == req.body.receiver_id) || (chatReply.sender_id == req.body.receiver_id && chatReply.receiver_id == req.id))) {
            return res.status(400).json(structure(null, "This is not your chat reply", 400));
        }
        if (contactDetail == null) {
            return res.status(400).json(structure(null, "He/She is not in your Contact", 400));
        }

        let info = {
            sender_id: req.id,
            receiver_id: req.body.receiver_id,
            sentTime: new Date(),
            chat_message: req.body.chat_message,
            chat_reply_id: req.body.chat_reply_id,
            chat_Medianame: ''
        };
        const rplychat = await Chat.query().insert(info);
        res.status(200).json(structure(rplychat, "Reply message Sent", 200));
    }
    catch (err) {
        res.status(400).json(structure(null, `${err}`, 400));
    }
}

const sendChat = async (req, res) => {
    try {
        const user = await Users.query().findOne({ email: req.body.email });
        if (!user) {
            const invitePerson = await Contact.query().findOne({ reg_user_id: req.id, email: req.body.email });
            if (invitePerson.reg == "Invite") {
                mailTemplate.InviteMail(invitePerson.email);
                return res.status(200).json(structure(null, "He is not in Whatsapp!! Invite Mail sent!", 200));
            }
            return res.status(400).json(structure(null, "User Not Exixts in your contact", 400));
        }
        const id1 = await Contact.query().findOne({ reg_user_id: req.id, phonenumber: user.phonenumber });
        if (id1 == null) {
            return res.status(400).json(structure(null, "He/She is not in your Contact", 400));
        }

        let info = {
            sender_id: req.id,
            receiver_id: user.id,
            sentTime: new Date(),
            chat_message: req.body.chat_message,
            chat_reply_id: null,
            chat_Medianame: ''
        }
        const chat = await Chat.query().insert(info)
        res.status(200).json(structure(chat, "Message Sent Successfully", 200));
    }
    catch (err) {
        res.status(400).json(structure(null, `${err}`, 400));
    }
}

const dltchat = async (req, res) => {

    try {
        const reqParams = Number(req.params.id)
        const cnt = await Chat.query().findOne({ id: reqParams })
        if (!((cnt.sender_id == req.id && cnt.receiver_id == req.body.receiver_id) || (cnt.sender_id == req.body.receiver_id && cnt.receiver_id == req.id))) {
            return res.status(400).json(structure(null, "Ivalid users Chat reply message", 400));
        }
        const chatDetail = await Chat.query().findById(req.params.id);
        const time = timediff(chatDetail.sentTime, new Date(), 'H');

        const timing = await Dlt.query().findById(1);
        if ((time.hours) >= timing.ChatDltTime) {
            res.status(400).json(structure(null, "You can't Delete this message!!", 400));
        }
        else {
            try {
                const sdf = { chat_reply_id: null };
                const adsf = await Chat.query().where('chat_reply_id', reqParams).update(sdf);
                const dltProd = await Chat.query().delete().where({ id: reqParams });
                res.status(200).send({ status: 200, message: "Message Deleted Successfully" });
            }
            catch (err) {
                res.status(400).json(structure(null, "Message not Deleted" + err, 400));
            }

        }
    } catch (err) {
        res.status(400).json(structure(null, `${err}`, 400));
    }
}

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
        callb(structure(null, "Uploaded file not similar to JPEG,JPG PNG,PDF", 400));
    }
}).single('myimage')

const sentImg = async (req, res) => {
    try {
        name = req.user;
        chat_sender = req.id;
        upload(req, res, async function (err) {
            if (err) {
                res.send(err);
            }
            else {
                try {

                    const user = await Users.query().findById(req.params.id);
                    if (!user) {
                        return res.status(400).json(structure(null, "Enter a valid User!!", 400));
                    }
                    const id1 = await Contact.query().findOne({ reg_user_id: chat_sender, phonenumber: user.phonenumber });
                    if (id1 == null) {
                        return res.status(400).json(structure(null, "He/She is not in your Contact", 400));
                    }
                    req.body.chat_message = "Media file"
                    req.body.chat_MediaName = name + new Date() + extn
                    req.body.sender_id = chat_sender
                    req.body.sentTime = new Date()
                    req.body.receiver_id = Number(req.params.id)
                    let fileDetails = req.body
                    let filesUploads = await Chat.query().insert(fileDetails);
                    res.status(200).json(structure(fileDetails, "Media Sent SuccessFully", 200));
                }
                catch (err) {
                    res.status(400).json(structure(null, `${err}`, 400));
                }
            }
        })
    }
    catch (err) {
        res.status(400).json(structure(null, `${err}`, 400));
    }

}

const storage2 = multer.diskStorage({
    destination: 'whatsappStatus',
    filename: function (req, file, cb) {
        status_extn = path.extname(file.originalname)
        cb(null, statusname + new Date().toISOString().replace(/:/g, "-") + path.extname(file.originalname));

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

        callb(structure(null, "Uploaded file not similar to JPEG,JPG PNG,PDF", 400));
    }
}).single('myStatusImage')


const sentStatus = async (req, res) => {
    statusname = req.user
    auth_userid = req.id
    console.log(auth_userid)

    upload2(req, res, async function (err) {
        if (err) {
            res.send(err);
        }
        else {
            try {
                req.body.status_File_Name = statusname + status_extn;
                req.body.sent_status_Time = new Date();
                req.body.user_id = auth_userid;
                let fileDetails = req.body;
                filesUpload = await SendStatus.query().insert(fileDetails);
                res.status(200).json(structure(null, "Status updated SuccessFully", 200));
            }
            catch (err) {
                res.status(400).json(structure(null, `${err}`, 400));
            }

        }
    })
}


const dltstatus = async (req, res) => {
    try {
        const statusDetail = await SendStatus.query().findById(req.params.id);
        const time1 = timediff(statusDetail.sent_Status_Time, new Date(), 'H');
        const timing = await Dlt.query().findById(1);
        if ((time1.hours) >= timing.StatusDltTime) {
            try {
                const dltProd = await SendStatus.query().delete().where({ id: req.params.id });
                res.status(200).json(structure(null, "Status Deleted Successfully", 200));
            }
            catch {
                res.status(400).json(structure(null, "Status not Deleted" + err, 400));
            }

        }
        else {
            res.status(400).json(structure(null, "24 Hours not completed", 400));
        }
    } catch (err) {
        res.status(400).json(structure(null, `${err}`, 400));
    }
}

const getChatMsg = async (req, res) => {
    try {
        const contacts = await Chat.query().select('chats.chat_message', 'user.name').joinRelated(Contact).leftJoin('user', 'chats.receiver_id', 'user.id').where('sender_id', req.id).where('receiver_id', req.params.id).orWhere('sender_id', req.params.id).where('receiver_id', req.id);
        res.status(200).json(structure(contacts, "Chat messages", 200));
    }
    catch (err) {
        res.status(400).json(structure(null, `${err}`, 400));
    }

}

module.exports = { sendChat, dltchat, sentImg, diff, getChatMsg, sentStatus, dltstatus, rplyChat }