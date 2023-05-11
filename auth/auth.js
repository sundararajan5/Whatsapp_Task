const jwt_token = require('jsonwebtoken');
require('dotenv').config();
const User = require('../model/user')
const bcrypt = require('bcrypt');


function structure(data, message, statusCode) {
    return { statusCode, message, data }
}


const authAdmin = (req, res, next) => {
    try {
        const token = req.headers['authorization']
        if (!token) {
            return res.json(structure(null, "Token not present", 401))
        }

        jwt_token.verify(token, process.env.ACCESS_TOKEN, async (err, user) => {
            if (err) {
                res.status(403).json(structure(null, "token invalid", 403))
            }
            try {
                const userDetail = await User.query().findOne({ email: user.email })
                if (!userDetail) {
                    return res.status(404).send({ status: 404, message: "Email Mismatch" });
                }
                const comparePass = await bcrypt.compare(user.password, userDetail.password)
                if (userDetail.role == "admin" && comparePass==true) {
                    next();
                }
                else if (comparePass==false) {
                    return res.status(404).send({ status: 404, message: "Password Mismatch" });
                }
            }
        catch(err) {
                    res.status(400).json(structure(null, ""+err, 400))
                }
            })
        }
    catch(err) {
            res.json(structure(null, ""+err, 500))
        }

    }

const authUser = async (req, res, next) => {
        try {
            const token = req.headers['authorization'];
            if (!token) {
                return res.json(structure(null, "Token not present", 401))
            }

            jwt_token.verify(token, process.env.ACCESS_TOKEN, async (err, user) => {
                if (err) {
                    res.status(403).json(structure(null, "token invalid", 403))
                }
                else {
                    try {
                        const userDetail = await User.query().findOne({ email: user.email })
                        if(!userDetail){
                            return res.status(404).send({ status: 404, message: "Email Mismatch" });
                        }
                        const comparePass = await bcrypt.compare(user.password, userDetail.password)
                        if (userDetail.role == "user"&& comparePass == true) {
                            req.body.id = userDetail.id
                            req.user = userDetail.name
                            next();
                        }
                        else{
                            return res.status(404).send({ status: 404, message: "Password Mismatch" });
                        }
                    }
                    catch (err) {
                        res.status(403).json(structure(null, ""+err, 404))
                    }
                }
            })
        }
        catch (err) {
            res.status(400).json(structure(null, "error"+err, 400))
        }

    }



    module.exports = { authAdmin, authUser }