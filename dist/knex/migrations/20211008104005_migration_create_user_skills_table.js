"use strict";

exports.up = function (knex) {
  return knex.schema.createTable('user_skills', function (table) {
    table.primary(['user_id', 'skill_id'], 'id');
    table.integer('user_id').references('id').inTable('users');
    table.integer('skill_id').references('id').inTable('skills');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('user_skills');
};