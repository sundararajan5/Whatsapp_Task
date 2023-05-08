const { Model } = require('objection');
const knex = require('../config/dbConfig');
Model.knex(knex);

class Contact extends Model {
    static get tableName() {
        return 'contacts';
    }
    
}
module.exports = Contact;