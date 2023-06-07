const Joi = require('joi')

function structure(data, message, status) {
    return { status, message, data }
}

const creatvalidation = async(req,res,next)=>{

    const CreateJoi = Joi.object({
        name:Joi.string().required(),
        phonenumber:Joi.number().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
    })
    const validation = CreateJoi.validate(req.body) 
    if(validation.error){
        return res.status(400).json(structure(validation.error.details[0].message , "Validation Error", 400))
    }
    next();

}


const contactValidation = async(req,res,next)=>{

    const JoiSchema = Joi.object({
        name:Joi.string().required(),
        phonenumber:Joi.number().required(),
        email: Joi.string().required(),
        reg: Joi.string().required(),
        status:Joi.string().required(),
        reg_user_id: Joi.number().required()
    })

    const validate = JoiSchema.validate(req.body)
    if(validate.error){
        return res.status(400).json(structure(validate.error.details[0].message , "Validation Error", 400))
    }
    next();
}

const chatValidation = async(req,res,next)=>{

    const JoiSchema = Joi.object({
        email:Joi.string().required(),
        chat_message:Joi.string().required()
    })

    const validate = JoiSchema.validate(req.body)
    if(validate.error){
        return res.status(400).json(structure(validate.error.details[0].message , "Validation Error", 400))
    }
    next();
}


module.exports = { creatvalidation , contactValidation , chatValidation}