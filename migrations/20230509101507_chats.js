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
        table.string("chat_mediaName").notNullable()
        table.integer('chat_reply_id').unsigned().references('chats.id')
        table.timestamp("sentTime").notNullable()
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("chats");
};
