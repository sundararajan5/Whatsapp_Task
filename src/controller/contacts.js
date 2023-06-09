const contactServ = require('../service/contacts')
const userServ = require('../service/user')
const response = require('../HelperFile/helperfile')


const addContacts = async (req, res) => {
    try {
        const user = await userServ.findUser({ phonenumber: req.body.phonenumber });
        if (user == undefined) {
            req.body.reg = "Invite"
        }
        if (user == null) {
            req.body.reg = "Invite"
        }
        else if (user.phonenumber == req.body.phonenumber) {
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
        const contactDetails = await contactServ.createContact(info);
        res.status(200).json(response.structure(contactDetails, "Conatact Added Successfully", 200));
    }
    catch (err) {
        res.status(400).json(response.structure(null, `${err}`, 400));
    }
}

const getById = async (req, res) => {
    try {
        const contacts = await contactServ.getContact(req.id);
        res.status(400).json(response.structure(contacts, "Your Contact List ", 200));
    }
    catch (err) {
        res.status(400).json(response.structure(null, `${err}`, 400));
    }

}


const blkContact = async (req, res) => {
    const block = await contactServ.getWhere(req.id, req.body.phonenumber);
    if (block.length == 0) {
        return res.status(400).json(response.structure(null, "He/she not in your contact", 400));
    }
    if (block[0].status == 'Blocked') {
        return res.status(400).json(response.structure(null, "Already you blocked this contact", 400));
    }
    else {
        try {
            req.body.status = 'Blocked'
            const uptBlock = await contactServ.updateContact(req.id, req.body.phonenumber, req.body);
            return res.status(200).json(response.structure(null, "Blocked the Contact", 200));
        }
        catch (err) {
            res.status(400).json(response.structure(null, `${err}`, 400));
        }
    }
}

module.exports = { addContacts, getById, blkContact }
