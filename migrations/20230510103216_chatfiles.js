/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("chatfiles", table => {
        table.increments("id").primary();
        table.integer("receiver_id").unsigned().references("contacts.id");
        table.integer("sender_id").unsigned().references("user.id");
        table.string("chat_fileName").notNullable()
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
