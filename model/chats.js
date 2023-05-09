const { Model } = require('objection');
const knex = require('../config/dbConfig');
Model.knex(knex);

class Chat extends Model {
    static get tableName() {
        return 'chats';
    } 
    }
module.exports = Chat;