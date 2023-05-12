const { Model } = require('objection');
const knex = require('../config/dbConfig');
Model.knex(knex);

class StatusTable extends Model {
    static get tableName() {
        return 'statustable';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                id: { type: 'integer' },
                user_id: { type: 'integer' },
                status_File_Name: { type: 'string' },
                sent_Status_Time: { type: 'string' }
            }
        }
    }

    }
module.exports = StatusTable;