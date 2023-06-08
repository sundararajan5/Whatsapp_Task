const Joi = require('joi');
const jwt = require('jsonwebtoken');
require('dotenv').config();

function structure(data, message, status) {
    return { status, message, data }
}

const GenerateToken = (req, res) => {

    const info = req.body;
    const JoiSchema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
    });
    const validate_Res = JoiSchema.validate(info);
    if (validate_Res.error) {
        res.status(400).json(structure(null, "Joi Validation Error" + validate_Res.error, 400));
    }
    else {
        try {
            const accestoken = jwt.sign(info, process.env.ACCESS_TOKEN);
            res.status(200).json(structure(accestoken, "Log-in Successfully!! ", 200));
        }
        catch (err) {
            res.status(400).json(structure(null, `Token not Generated ${err}`, 400));
        }
    }
}

module.exports = { GenerateToken }