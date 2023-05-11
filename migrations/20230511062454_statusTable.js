/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("statusTable", table => {
        table.increments("id").primary();
        table.integer("user_id").unsigned().references("user.id");
        table.string("status_File_Name").notNullable()
        table.timestamp("sent_Status_Time").notNullable()
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
