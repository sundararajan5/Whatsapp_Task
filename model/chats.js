const { Model } = require('objection');
const knex = require('../config/dbConfig');
const Contact = require('./contact');
Model.knex(knex);

class Chat extends Model {
    static get tableName() {
        return 'chats';
    } 
    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                id: { type: 'integer' },
                receiver_id: { type: 'number' },
                sender_id: { type: 'number' },
                chat_message: { type: 'string' },
                chat_MediaName: { type: 'string' }
            }
        }
    }
    static get relationMappings() {
       return {
        owner:{
            relation:Model.BelongsToOneRelation,
            modelClass:Contact,
            join:{
                from: 'chats.receiver_id',
                to:'contacts.id'
            }

        }
       }
    }


    }
module.exports = Chat;