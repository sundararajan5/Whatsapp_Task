const { Model } = require('objection');
const knex = require('../config/dbConfig');
Model.knex(knex);

class ChatFiles extends Model {
    static get tableName() {
        return 'chatfiles';
    } 
    }
module.exports = ChatFiles;