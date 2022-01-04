exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id');
    table.string('name').notNull();
    table.string('last_name').notNull();
    table.string('username').notNull();
    table.string('password').notNull();
    table.string('email').notNull();
    table.string('role').notNull();
    table.boolean('is_validated_email').defaultTo(false);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('users');
};
