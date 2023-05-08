const Contact = require("../model/contact");

function structure(data, message, status) {
    return { status, message, data }
}


const addContacts = async (req, res) => {

    try {
        let info = req.body
        const contactDetails = await Contact.query().insert(info)
        res.status(200).json(structure(contactDetails, "Conatact Added Successfully", 200))

    }
    catch (err) {
        console.log("error" + err)
        res.status(400).json(structure("" + err, "", 400))
    }
}

module.exports ={addContacts}
