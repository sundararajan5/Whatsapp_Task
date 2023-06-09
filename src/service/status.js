const Status = require('../model/status')

const insert = async (params) => {
    return await Status.query().insert(params);
}

const findById = async (params) => {
    return await Status.query().findById(params);
}

const deleteWhere = async (params) => {
    return await Status.query().delete().where(params)
}

module.exports = { insert, findById, deleteWhere }