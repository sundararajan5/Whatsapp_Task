/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("chats", table => {
        table.increments("id").primary();
        table.integer("receiver_id").unsigned();
        table.integer("sender_id").unsigned();
        table.string("chat_message").notNullable()
        table.timestamp("sentTime").notNullable()
        table.timestamp("dltTime").notNullable()
    });
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("chats");
};
