const User = require('../model/user')

const findUser = async (params) => {
    return await User.query().findOne(params)
}

const updateUser = async (params, params1) => {
    return await User.query().findOne(params).update(params1)
}

const createUser = async (params) => {
    return await User.query().insert(params);
}

const updateUser1 = async (params, params1) => {
    return await User.query().findById(params).update(params1);
}

const findById = async (params) => {
    return await User.query().findById(params);
}

const getUser = async () => {
    return await User.query().select('name', 'email', 'phonenumber').where('role', 'user');
}

module.exports = { findUser, updateUser, createUser, updateUser1, findById, getUser }