const dltTiming = require('../model/dltTiming')

const findById = async (params) => {
    return await dltTiming.query().findById(params);
}

const updateTime = async (params, params1) => {
    return await dltTiming.query().findById(params).update(params1);
}

module.exports = { findById, updateTime }