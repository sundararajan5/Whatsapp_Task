const { Model } = require('objection');
const knex = require('../config/dbConfig');
Model.knex(knex);

class Users extends Model {
    static get tableName() {
        return 'user';
    }
    static get jsonSchema() {
        return {
            type: 'object',
            required: ['email', 'password'],
            properties: {
                id: { type: 'integer' },
                name: { type: 'string' },
                email: { type: 'string' },
                password: { type: 'string' },
                role: { type: 'string' },
                phonenumber: { type: 'number' }
            }
        }
    }
}
module.exports = Users;