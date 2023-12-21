/**
 
@param { import("knex").Knex } knex
@returns { Promise<void> }
*/
exports.seed = async function(knex) {
  // Verwijdert ALLE bestaande items
  await knex('students').del();

  // Voeg gegevens in voor de 'users'-tabel
  await knex('students').insert([
    { id: 1, firstname: 'John', lastname: 'Doe', email: 'john.doe@example.com' },
    { id: 2, firstname: 'Jane', lastname: 'Doe', email: 'jane.doe@example.com' },
    { id: 3, firstname: 'Bob', lastname: 'Smith', email: 'bob.smith@example.com' }
    // Voeg meer rijen toe indien nodig
  ]);
};