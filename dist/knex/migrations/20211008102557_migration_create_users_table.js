"use strict";

exports.up = function (knex) {
  return knex.schema.createTable('users', function (table) {
    table.increments().primary();
    table.string('firstname', 255).notNullable();
    table.string('last_name', 255).notNullable();
    table.string('email', 255).notNullable();
    table.string('password', 255).notNullable();
    table.integer('role_id').references('id').inTable('roles').notNullable();
    table.integer('cohort_id').references('id').inTable('cohorts');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('users');
};