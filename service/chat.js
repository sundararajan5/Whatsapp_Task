const Chat = require('../model/chats')



const sendChat = async(req,res)=>{
    try{

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
        if (chatDetail.sentTime < new Date()) {
            console.log(chatDetail.dltTime);
            console.log(chatDetail.sentTime);
            console.log(new Date());
            res.status(404).send({ status: 404, message: "You can't Delete this message!!" });
        }
        else {
            try {
                console.log(chatDetail.sentTime);
                console.log(new Date());
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


module.exports ={sendChat , dltchat}