const jwt_token = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcrypt');
const User = require('../model/user');
const response = require('../HelperFile/helperfile');


const authAdmin = (req, res, next) => {
    try {
        const token = req.headers['authorization'];
        if (!token) {
            return res.json(response.structure(null, "Token not Present in Auth", 401));
        }
        jwt_token.verify(token, process.env.ACCESS_TOKEN, async (err, user) => {
            if (err) {
                res.status(403).json(response.structure(null, "Token is invalid", 403));
            }
            try {
                const userDetail = await User.query().findOne({ email: user.email });
                if (!userDetail) {
                    return res.status(404).json(response.structure(null,"Email Id Mismatch" ,404));
                }
                const comparePass = bcrypt.compareSync(user.password, userDetail.password);
                if (userDetail.role == "admin" && comparePass==true) {
                    next();
                }
                else if (comparePass==false){
                    return res.status(404).json(response.structure(null,"You entered password mismatch",404));
                }
                else{
                    return res.status(404).json(response.structure(null,"You are not admin",404));
                }
            }
        catch(err) {
                    res.status(400).json(response.structure(null, ""+err, 400));
                }
            })
        }
    catch(err) {
            res.json(response.structure(null, ""+err, 400));
        }
    }

const authUser = async (req, res, next)=>{
        try {
            const token = req.headers['authorization'];
            if (!token) {
                return res.json(response.structure(null, "Token not present in Auth", 401));
            }
            jwt_token.verify(token, process.env.ACCESS_TOKEN, async (err, user) => {
                if (err) {
                    res.status(403).json(response.structure(null, "Token is invalid", 403));
                }
                else {
                    try {
                        const userDetail = await User.query().findOne({ email: user.email });
                        if(!userDetail){
                            res.status(404).json(response.structure(null,"Email Id Mismatch", 404));
                        }
                        const comparePass = bcrypt.compareSync(user.password, userDetail.password)
                        if (userDetail.role == "user"&& comparePass == true) {

                            req.id = userDetail.id
                            req.user = userDetail.name
                            next();
                        }
                        else if(comparePass==false){
                            return res.status(404).send({ status: 404, message: "You entered password mismatch" });
                        }
                        else{
                            return res.status(404).send({ status: 404, message: "Admin Not Allowed" });
                        }
                    }
                    catch (err) {
                        res.status(403).json(response.structure(null, ""+err, 404));
                    }
                }
            })
        }
        catch (err) {
            res.status(400).json(response.structure(null, "error"+err, 400));
        }
    }

    module.exports = { authAdmin, authUser }