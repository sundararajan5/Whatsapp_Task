const Contact = require('../model/contact')

const findOne = async (params) => {
    return await Contact.query().findOne(params);
}

const createContact = async (params) => {
    return await Contact.query().insert(params);
}

const getContact = async (id) => {
    return await Contact.query().select('name', 'phonenumber', 'reg', 'status').where('reg_user_id', id);
}

const updateContact = async (id, phonenumber, body) => {
    return await Contact.query().where('reg_user_id', id).where('phonenumber', phonenumber).update(body);
}

const getWhere = async (id, phonenumber) => {
    return await Contact.query().where('reg_user_id', id).where('phonenumber', phonenumber);
}

module.exports = { findOne, createContact, getContact, updateContact, getWhere }