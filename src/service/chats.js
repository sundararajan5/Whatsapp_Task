const Chat = require('../model/chats');

const findOne = async (params) => {
    return await Chat.query().findOne(params)
}

const Insert = async (params) => {
    return await Chat.query().insert(params);
}

const findById = async (params) => {
    return await Chat.query().findById(params);
}

const deleteWhere = async (params) => {
    return await Chat.query().delete().where(params);
}

const getWhere = async (reqParams, sdf) => {
    return await Chat.query().where('chat_reply_id', reqParams).update(sdf);
}
module.exports = { findOne, Insert, findById, deleteWhere, getWhere }