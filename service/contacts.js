const Contact = require("../model/contact");
const Users = require("../model/user");

function structure(data, message, status) {
    return { status, message, data }
}


const addContacts = async (req, res) => {
    console.log(req.body.id)
    try {
        const jwt_user = await Users.query().findOne({ phonenumber: req.body.phonenumber })
        console.log(jwt_user)
        if (jwt_user == null) {
            req.body.reg = "Invite"
        }
        else if (jwt_user.phonenumber == req.body.phonenumber) {
            req.body.reg = "SignedIn"
        }
        let info = {
            name: req.body.name,
            phonenumber: req.body.phonenumber,
            email:req.body.email,
            reg: req.body.reg,
            reg_user_id: req.body.id,
            status: req.body.status
        }
        const contactDetails = await Contact.query().insert(info)
        res.status(200).json(structure(contactDetails, "Conatact Added Successfully", 200))
    }
    catch (err) {
        console.log("error" + err)
        res.status(400).json(structure("" + err, "", 400))
    }
}



const getById = async (req, res) => {
    const contacts = await Contact.query().select('name','phonenumber').where('reg_user_id',req.body.id)
    res.status(400).json(structure(contacts, "Your Contact List ", 200))
}


const blkContact = async (req, res) => {
    console.log(req.body.id);
     req.body.status ='Blocked'
     const block = await Contact.query().findOne({phonenumber:req.body.phonenumber})
     console.log(block.reg_user_id )
     res.status(200).json({ data: "Blocked" })
}


module.exports = { addContacts, getById, blkContact }
