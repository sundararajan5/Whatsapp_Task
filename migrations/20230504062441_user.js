/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('user', function(table) {
        table.increments().primary()
        table.string('name', 255).notNullable().unique()
        table.string('email', 255).notNullable()
        table.string('password', 255).notNullable()
        table.string('role').defaultTo("user")
        table.bigInteger('phonenumber').notNullable()
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
