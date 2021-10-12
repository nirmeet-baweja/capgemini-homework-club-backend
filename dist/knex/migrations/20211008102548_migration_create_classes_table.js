"use strict";

exports.up = function (knex) {
  return knex.schema.createTable('classes', function (table) {
    table.increments().primary();
    table.timestamp('date').defaultTo(knex.fn.now());
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.string('comments', 255);
    table.string('call_link', 255);
    table["boolean"]('is_submitted').notNullable().defaultTo(false);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('classes');
};