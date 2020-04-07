exports.up = function(knex) {
  return knex.schema.createTable('bytes', function(table) {
      table.integer('id').defaultTo(1)
      table.integer('total_bytes').defaultTo(0)
      table.dateTime('last_bin').defaultTo(knex.raw("now()"))
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('bytes')
};
