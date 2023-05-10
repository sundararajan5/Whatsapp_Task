const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../model/user')
const bcrypt = require('bcrypt');


function structure(data, message, status) {
    return { status, message, data }
}


const authAdmin = (req, res, next) => {
    const token = req.headers['authorization']
    jwt.verify(token, process.env.ACCESS_TOKEN, async (err, user) => {
        try {
            const jwt_user = await User.query().findOne({ email: user.email })
            const comp = await bcrypt.compare(user.password, jwt_user.password)
                if (jwt_user.role=="admin"&&comp == true) {
                    next();
                }
                
        }
        catch (err) {
            res.status(400).json(structure(null, err, 400))
        }
    })
}

const authUser = async (req, res, next) => {
    try {
        const token = req.headers['authorization'];

        jwt.verify(token, process.env.ACCESS_TOKEN, async (err, user) => {
            if (err) {
                res.status(403).json(structure(null, "token invalid", 403))
            }
            else {
                try {
                    const jwt_role = await User.query().findOne({ email: user.email })
                    const comp = await bcrypt.compare(user.password, jwt_role.password)
                        if (jwt_role.role == "user"&&comp==true) {
                            req.body.user = jwt_role.name
                            next();
                        }
                    
                }
                catch (err) {
                    res.status(403).json(structure(null, "Password Incorrect", 404))
                }
            }
        })
    }
    catch (err) {
        res.status(400).json(structure(null, "error" + err, 400))
    }

}



module.exports = { authAdmin, authUser }