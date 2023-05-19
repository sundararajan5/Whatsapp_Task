/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('user', function(table) {
        table.increments().primary()
        table.string('name', 255)
        table.string('email', 255).unique()
        table.string('password', 255)
        table.string('role').defaultTo("user")
        table.bigInteger('phonenumber').unique()
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('user')
};
