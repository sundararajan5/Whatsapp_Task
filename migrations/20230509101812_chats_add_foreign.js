/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.table("chats", table => {
        table.foreign("sender_id").references("user.id");
        table.foreign("receiver_id").references("contacts.id");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    table.dropForeign("contact_id");
    table.dropForeign("user_id");
};
