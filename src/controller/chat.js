const path = require('path');
const multer = require('multer');
const timediff = require('timediff');

const Chat = require('../model/chats');
const mailTemplate = require("../template/MailTemplate");
const Contact = require('../model/contact');
const response = require('../HelperFile/helperfile');
const contactServ = require('../service/contacts');
const userServ = require('../service/user');
const chatServ = require('../service/chats');
const statusServ = require('../service/status');
const dltServ = require('../service/dltTiming');


let statusname;
let name;
let extn;
let status_extn;
let auth_userid;
let chat_sender;



const diff = async (req, res) => {
    try {
        let info = {
            statusDltTime: req.body.statusDltTime,
            chatDltTime: req.body.chatDltTime
        }
        const changeTime = await dltServ.updateTime(1, info);
        res.status(200).json(response.structure(null, "Delete Time will changed ", 200));
    }
    catch (err) {
        return res.status(400).json(response.structure(null, `${err}`, 400));
    }

}

const rplyChat = async (req, res) => {
    try {
        const user = await userServ.findById(req.body.receiver_id);
        if (user == undefined) {
            return res.status(200).json(response.structure(null, "He is not in Whatsapp!! Invite Mail sent!", 200));
        }
        if (user.accountStatus == "Not Verified") {
            return res.status(400).json(response.structure(null, " Your account is not verified ", 400));
        }
        if (!user) {
            return res.status(400).json(response.structure(null, "User Not Exixts in your contact", 400));
        }
        const contactDetail = await contactServ.findOne({ reg_user_id: req.id, phonenumber: user.phonenumber });
        const chatReply = await chatServ.findOne({ id: req.body.chat_reply_id });

        if (!((chatReply.sender_id == req.id && chatReply.receiver_id == req.body.receiver_id) || (chatReply.sender_id == req.body.receiver_id && chatReply.receiver_id == req.id))) {
            return res.status(400).json(response.structure(null, "This is not your chat reply", 400));
        }
        if (contactDetail == null) {
            return res.status(400).json(response.structure(null, "He/She is not in your Contact", 400));
        }

        let info = {
            sender_id: req.id,
            receiver_id: req.body.receiver_id,
            sentTime: new Date(),
            chat_message: req.body.chat_message,
            chat_reply_id: req.body.chat_reply_id,
            chat_Medianame: ''
        };
        const rplychat = await chatServ.Insert(info);
        res.status(200).json(response.structure(rplychat, "Reply message Sent", 200));
    }
    catch (err) {
        res.status(400).json(response.structure(null, `${err}`, 400));
    }
}

const sendChat = async (req, res) => {
    try {
        const user = await userServ.findUser({ email: req.body.email });
        if (user == undefined) {
            return res.status(200).json(response.structure(null, "He is not in Whatsapp!! Invite Mail sent!", 200));
        }
        if (user.accountStatus == "Not Verified") {
            return res.status(400).json(response.structure(null, " Your account is not verified ", 400));
        }
        if (!user) {
            return res.status(400).json(response.structure(null, "User Not Exixts in your contact", 400));
        }
        const invitePerson = await contactServ.findOne({ reg_user_id: req.id, email: req.body.email });
        if (invitePerson.status = "Blocked") {
            return res.status(400).json(response.structure(null, "You blocked this contact", 400))
        }
        if (invitePerson.reg == "Invite") {
            mailTemplate.InviteMail(invitePerson.email);
            return res.status(200).json(response.structure(null, "He is not in Whatsapp!! Invite Mail sent!", 200));
        }
        const id1 = await contactServ.findOne({ reg_user_id: req.id, phonenumber: user.phonenumber });
        if (id1 == null) {
            return res.status(400).json(response.structure(null, "He/She is not in your Contact", 400));
        }

        let info = {
            sender_id: req.id,
            receiver_id: user.id,
            sentTime: new Date(),
            chat_message: req.body.chat_message,
            chat_reply_id: null,
            chat_Medianame: ''
        }
        const chat = await chatServ.Insert(info)
        res.status(200).json(response.structure(chat, "Message Sent Successfully", 200));
    }
    catch (err) {
        res.status(400).json(response.structure(null, `${err}`, 400));
    }
}

const dltchat = async (req, res) => {

    try {
        const user = await userServ.findUser({ email: req.body.email });
        if (user.accountStatus == "Not Verified") {
            return res.status(400).json(response.structure(null, " Your account is not verified ", 400));
        }
        const reqParams = Number(req.params.id)
        const cnt = await chatServ.findOne({ id: reqParams })
        if (!((cnt.sender_id == req.id && cnt.receiver_id == req.body.receiver_id) || (cnt.sender_id == req.body.receiver_id && cnt.receiver_id == req.id))) {
            return res.status(400).json(response.structure(null, "Ivalid users Chat reply message", 400));
        }
        const chatDetail = await chatServ.findById(req.params.id);
        const time = timediff(chatDetail.sentTime, new Date(), 'H');

        const timing = await dltServ.findById(1);
        if ((time.hours) >= timing.ChatDltTime) {
            res.status(400).json(response.structure(null, "You can't Delete this message!!", 400));
        }
        else {
            try {
                const sdf = { chat_reply_id: null };
                const adsf = await chatServ.getWhere(reqParams, sdf);
                const dltProd = await chatServ.deleteWhere({ id: reqParams });
                res.status(200).send({ status: 200, message: "Message Deleted Successfully" });
            }
            catch (err) {
                res.status(400).json(response.structure(null, "Message not Deleted" + err, 400));
            }

        }
    } catch (err) {
        res.status(400).json(response.structure(null, `${err}`, 400));
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
        const filetypes = /jpeg|jpg|png|pdf|docx/;
        const mimetype = filetypes.test(file.mimetype);
        const extname1 = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname1) {
            return callb(null, true);
        }
        callb(structure(null, "Uploaded file not similar to JPEG,JPG PNG,PDF,DOC", 400));
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

                    const user = await userServ.findById(req.params.id);
                    if (user.accountStatus == "Not Verified") {
                        return res.status(400).json(response.structure(null, " Your account is not verified ", 400));
                    }
                    if (!user) {
                        return res.status(400).json(response.structure(null, "Enter a valid User!!", 400));
                    }
                    const id1 = await contactServ.findOne({ reg_user_id: chat_sender, phonenumber: user.phonenumber });
                    if (id1 == null) {
                        return res.status(400).json(response.structure(null, "He/She is not in your Contact", 400));
                    }
                    req.body.chat_message = "Media file"
                    req.body.chat_MediaName = name + new Date() + extn
                    req.body.sender_id = chat_sender
                    req.body.sentTime = new Date()
                    req.body.receiver_id = Number(req.params.id)
                    let fileDetails = req.body
                    let filesUploads = await chatServ.Insert(fileDetails);
                    res.status(200).json(response.structure(fileDetails, "Media Sent SuccessFully", 200));
                }
                catch (err) {
                    res.status(400).json(response.structure(null, `${err}`, 400));
                }
            }
        })
    }
    catch (err) {
        res.status(400).json(response.structure(null, `${err}`, 400));
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

    upload2(req, res, async function (err) {
        if (err) {
            res.status(400).json(response.structure(null, `${err}`, 400));
        }
        else {
            try {
                const user = await userServ.findById(req.params.id);
                if (!user) {
                    return res.status(400).json(response.structure(null, "Enter a valid User!!", 400));
                }
                if (user.accountStatus == "Not Verified") {
                    return res.status(400).json(response.structure(null, " Your account is not verified ", 400));
                }
                req.body.status_File_Name = statusname + status_extn;
                req.body.sent_status_Time = new Date();
                req.body.user_id = auth_userid;
                let fileDetails = req.body;
                filesUpload = await statusServ.insert(fileDetails);
                res.status(200).json(response.structure(null, "Status updated SuccessFully", 200));
            }
            catch (err) {
                res.status(400).json(response.structure(null, `${err}`, 400));
            }

        }
    })
}


const dltstatus = async (req, res) => {
    try {
        const user = await userServ.findById(req.params.id);
        if (!user) {
            return res.status(400).json(response.structure(null, "Enter a valid User!!", 400));
        }
        if (user.accountStatus == "Not Verified") {
            return res.status(400).json(response.structure(null, " Your account is not verified ", 400));
        }
        const statusDetail = await statusServ.findById(req.params.id);
        const time1 = timediff(statusDetail.sent_Status_Time, new Date(), 'H');
        const timing = await dltServ.findById(1);
        if ((time1.hours) >= timing.StatusDltTime) {
            try {
                const dltProd = await statusServ.deleteWhere({ id: req.params.id });
                res.status(200).json(response.structure(null, "Status Deleted Successfully", 200));
            }
            catch {
                res.status(400).json(response.structure(null, "Status not Deleted" + err, 400));
            }

        }
        else {
            res.status(400).json(response.structure(null, "24 Hours not completed", 400));
        }
    } catch (err) {
        res.status(400).json(response.structure(null, `${err}`, 400));
    }
}

const getChatMsg = async (req, res) => {
    try {
        const user = await userServ.findById(req.params.id);
        if (!user) {
            return res.status(400).json(response.structure(null, "Enter a valid User!!", 400));
        }
        if (user.accountStatus == "Not Verified") {
            return res.status(400).json(response.structure(null, " Your account is not verified ", 400));
        }
        const contacts = await Chat.query().select('chats.chat_message', 'user.name').joinRelated(Contact).leftJoin('user', 'chats.receiver_id', 'user.id').where('sender_id', req.id).where('receiver_id', req.params.id).orWhere('sender_id', req.params.id).where('receiver_id', req.id);
        res.status(200).json(response.structure(contacts, "Chat messages", 200));
    }
    catch (err) {
        res.status(400).json(response.structure(null, `${err}`, 400));
    }

}

module.exports = { sendChat, dltchat, sentImg, diff, getChatMsg, sentStatus, dltstatus, rplyChat }