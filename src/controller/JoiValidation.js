const Joi = require('joi')
const response = require('../HelperFile/helperfile')


const creatvalidation = async (req, res, next) => {

    const CreateJoi = Joi.object({
        name: Joi.string(),
        phonenumber: Joi.number(),
        email: Joi.string(),
        password: Joi.string(),
        role: Joi.string()
    })
    const validation = CreateJoi.validate(req.body);
    if (validation.error) {
        return res.status(400).json(response.structure(validation.error.details[0].message, "Validation Error", 400));
    }
    next();

}

const verify = async (req, res, next) => {
    const JoiSchema = Joi.object({
        email: Joi.string(),
        password: Joi.string(),
        otp: Joi.number()
    })
    const validation = JoiSchema.validate(req.body);
    if (validation.error) {
        return res.status(400).json(response.structure(validation.error.details[0].message, "Validation Error", 400));
    }
    next();
}


const contactValidation = async (req, res, next) => {

    const JoiSchema = Joi.object({
        name: Joi.string().required(),
        phonenumber: Joi.number().required(),
        email: Joi.string().required(),
        reg: Joi.string(),
        status: Joi.string(),
        reg_user_id: Joi.number()
    })

    const validate = JoiSchema.validate(req.body);
    if (validate.error) {
        return res.status(400).json(response.structure(validate.error.details[0].message, "Validation Error", 400));
    }
    next();
}


const updtContactValidation = async (req, res, next) => {

    const JoiSchema = Joi.object({
        phonenumber: Joi.number().required()
    })

    const validate = JoiSchema.validate(req.body);
    if (validate.error) {
        return res.status(400).json(response.structure(validate.error.details[0].message, "Validation Error", 400));
    }
    next();
}

const chatValidation = async (req, res, next) => {

    const JoiSchema = Joi.object({
        email: Joi.string().required(),
        chat_message: Joi.string().required()
    })
    const validate = JoiSchema.validate(req.body);
    if (validate.error) {
        return res.status(400).json(response.structure(validate.error.details[0].message, "Validation Error", 400));
    }
    next();
}


const dltTimeValidation = async (req, res, next) => {

    const JoiSchema = Joi.object({
        statusDltTime: Joi.number().required(),
        chatDltTime: Joi.number().required()
    })
    const validate = JoiSchema.validate(req.body);
    if (validate.error) {
        return res.status(400).json(response.structure(validate.error.details[0].message, "Validation Error", 400));
    }
    next();
}


const replyValidation = async (req, res, next) => {

    const JoiSchema = Joi.object({
        sender_id: Joi.number(),
        receiver_id: Joi.number().required(),
        sentTime: Joi.date(),
        chat_message: Joi.string().required(),
        chat_reply_id: Joi.number().required(),
        chat_Medianame: Joi.string()
    })
    const validate = JoiSchema.validate(req.body);
    if (validate.error) {
        return res.status(400).json(response.structure(validate.error.details[0].message, "Validation Error", 400));
    }
    next();
}

const dltchatVal = async (req, res, next) => {
    const JoiSchema = Joi.object({
        receiver_id: Joi.number().required()
    })
    const validate = JoiSchema.validate(req.body);
    if (validate.error) {
        return res.status(400).json(response.structure(validate.error.details[0].message, "Validation Error", 400));
    }
    next();
}






module.exports = { creatvalidation, contactValidation, chatValidation, updtContactValidation, verify, dltTimeValidation, replyValidation, dltchatVal }