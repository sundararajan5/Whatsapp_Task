const Contact = require("../model/contact");
const Users = require("../model/user");

function structure(data, message, status) {
    return { status, message, data }
}


const addContacts = async (req, res) => {
    console.log(req.body.id)
    try {
        const user = await Users.query().findOne({ phonenumber: req.body.phonenumber })
        console.log(user)
        if (user == null) {
            req.body.reg = "Invite"
        }
        else if (user.phonenumber == req.body.phonenumber){
            req.body.reg = "SignedIn"
        }
        let info = {
            name: req.body.name,
            phonenumber: req.body.phonenumber,
            email: req.body.email,
            reg: req.body.reg,
            reg_user_id: req.id,
            status: req.body.status
        }
        const contactDetails = await Contact.query().insert(info)
        res.status(200).json(structure(contactDetails, "Conatact Added Successfully", 200))
    }
    catch (err) {
        res.status(400).json(structure(null,`${err}`, 400))
    }
}

const getById = async (req, res) => {
    try {
        const contacts = await Contact.query().select('name', 'phonenumber').where('reg_user_id', req.id)
        res.status(400).json(structure(contacts, "Your Contact List ", 200))
    }
    catch (err) {
        res.status(400).json(structure(null,`${err}`,400))
    }

}


const blkContact = async (req, res) => {
    const block = await Contact.query().where('reg_user_id', req.id).where('phonenumber', req.body.phonenumber)
    if(block.length==0){
        return res.status(400).json(structure(null, "He/she not in your contact", 400))
    }
    if (block[0].status == 'Blocked') {
        return res.status(400).json(structure(null, "Already you blocked this contact", 400))
    }
    else {
        try {
            req.body.status = 'Blocked'
            const uptBlock = await Contact.query().where('reg_user_id', req.id).where('phonenumber', req.body.phonenumber).update(req.body)
            return res.status(200).json(structure(null, "Blocked the Contact", 200))
        }
        catch(err){
            res.status(400).json(structure(null,`${err}`,400))
        }
    }
}


module.exports = { addContacts, getById, blkContact }
