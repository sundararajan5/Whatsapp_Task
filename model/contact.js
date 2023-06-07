const { Model } = require('objection');
const knex = require('../config/dbConfig');
const Chat = require('./chats');
Model.knex(knex);

class Contact extends Model {
    static get tableName() {
        return 'contacts';
    }
    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                id: { type: 'integer' },
                name: { type: 'string' },
                phonenumber: { type: 'number' },
                reg: { type: 'string' },
                reg_user_id: { type: 'integer' },
                status: { type: 'string' }
            }
        }
    }
    static get relationMappings() {
        return {
            owner: {
                relation: Model.HasOneRelation,
                modelClass: Chat,
                join: {
                    from: 'contacts.id',
                    to: 'chats.receiver_id'
                }
            }
        };
    };
}

module.exports = Contact;