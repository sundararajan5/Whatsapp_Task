const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../model/user')
const bcrypt = require('bcrypt');



const authAdmin = (req,res,next)=>{
    const token = req.headers['authorization']
    jwt.verify(token,process.env.ACCESS_TOKEN, async(err,user)=>{
        try{
            const jwt_user = await User.query().findOne({email:user.email})
            bcrypt.compare(user.password,jwt_user.password, function(err,result){
                if(jwt_user.role == "admin"&& result==true){
                    next();
                }
            })
        }
        catch(err){
            res.status(400).send(""+err)
        }
    })
}


module.exports = { authAdmin }