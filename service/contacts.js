const Contact = require("../model/contact");
const Users = require("../model/user");
function structure(data, message, status) {
    return { status, message, data }
}


const addContacts = async (req, res) => {

    try {
        const jwt_user = await Users.query().findOne({phonenumber:req.body.phonenumber})
        console.log(jwt_user)
        if(jwt_user==null)
        {
            req.body.reg = "Invite"
        }
        else if (jwt_user.phonenumber==req.body.phonenumber){
            req.body.reg ="SignedIn"
        }
        let info ={
            name :req.body.name,
            phonenumber:req.body.phonenumber,
            reg:req.body.reg,
            reg_user_id:req.body.reg_user_id,
            status:req.body.status
        }
        const contactDetails = await Contact.query().insert(info)
        res.status(200).json(structure(contactDetails, "Conatact Added Successfully", 200))
    }
    catch (err) {
        console.log("error" + err)
        res.status(400).json(structure("" + err, "", 400))
    }
}

const getById = async (req,res)=>{
    params = req.params.id;
    const contacts = await Contact.query().where('reg_user_id', params)
    res.send(contacts)
}


const blkContact = async(req,res)=>{
    const block = await Contact.query().findOne({phonenumber:req.body.phonenumber}).patch(req.body)
    res.status(200).json({data:"Blocked"})
}


module.exports ={addContacts , getById,blkContact }
