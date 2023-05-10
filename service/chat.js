const Chat = require('../model/chats')
const ChatFiles = require('../model/chatfiles')
const path = require('path');
const multer = require('multer');
const timediff = require('timediff');
const { date } = require('joi');
const Contact = require('../model/contact')

let deleteTime = 1

const diff= async(req,res)=>{
    deleteTime = req.body.time
    res.send("Deletion Time Update "+ deleteTime)
}

const sendChat = async(req,res)=>{
    try{
        const id = await Contact.query().findOne({id:req.body.receiver_id})
        console.log(id);
        if(id.reg=='Invite')
        {
            return res.send("He is not in Whatsapp")
        }
        let info = {
            sender_id: req.body.sender_id,
            receiver_id:req.body.receiver_id,
            sentTime:new Date(),
            chat_message:req.body.chat_message,
            dltTime:new Date(Date.now() + 1 * (60 * 60 * 1000))}
        const chat = await Chat.query().insert(info)
        res.send(chat);
    }
    catch(err){
        res.send(err)
    }
}


const dltchat = async (req, res) => {

    try {
        const chatDetail = await Chat.query().findById(req.params.id)
       const time = timediff(chatDetail.sentTime,new Date(),'H')
       console.log(time.hours);
        if ((time.hours)>=deleteTime) {
            res.status(404).send({ status: 404, message: "You can't Delete this message!!" });
        }
        else {
            try {
                const dltProd = await Chat.query().delete().where({id:req.params.id})
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

let name;
let ext ;
const storage = multer.diskStorage({
    destination: 'uploads',
    filename : function(req,file,cb){
        cb(null,name + new Date().toISOString().replace(/:/g , "-")+ path.extname(file.originalname));
        ext = path.extname(file.originalname)
    }
})

const maxSize = 2*1000*1000;


const upload = multer({
    storage: storage,
    limits:{
        fileSize : maxSize
    },
    fileFilter : function(req,file,callb){
        const filetypes = /jpeg|jpg|png|pdf|/;
        const mimetype = filetypes.test(file.mimetype);
        const extname1 = filetypes.test(path.extname(file.originalname).toLowerCase());

        if(mimetype && extname1){
            return callb(null,true);
        }

        callb("Uploaded file not similar to JPEG,JPG PNG,PDF")
    }
}).single('myimage')



const sentImg = async(req,res)=>{
    name = req.body.user
     upload (req,res , async function(err){
        if(err){
            res.send(err);
        }
        else{
            req.body.chat_fileName = name+ext
            let fileDetails = req.body
            filesUpload = await ChatFiles.query().insert(fileDetails)
            res.send('success')
        }
    })



}


// const getChatMsg = async(req,res)=>{
//     params = req.params.id;
//     const contacts = await Contact.query().where('reg_user_id', params)
//     res.send(contacts)
// }



module.exports ={sendChat , dltchat , sentImg , diff}