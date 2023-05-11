/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('contacts', function(table) {
        table.increments().primary()
        table.string('name', 255)
        table.bigInteger('phonenumber')
        table.string('email', 255)
        table.string('reg').defaultTo("SignedIn")
        table.integer('reg_user_id').unsigned()
        table.string('status').defaultTo("Normal")
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("contacts");
  
};
