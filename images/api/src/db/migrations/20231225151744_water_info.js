/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('water_info', function(table) {
      table.increments('id').primary();
      table.integer('student_id').unsigned().notNullable();
      table.foreign('student_id').references('id').inTable('students');
      table.integer('glasses_of_water').notNullable();
      table.timestamps(true, true);
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function(knex) {
    return knex.schema.dropTable('water_info');
  };
  
