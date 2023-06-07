const { Model } = require('objection');
const knex = require('../config/dbConfig');
Model.knex(knex);

class DltTiming extends Model {
    static get tableName() {
        return 'timing';
    }
}
module.exports = DltTiming;