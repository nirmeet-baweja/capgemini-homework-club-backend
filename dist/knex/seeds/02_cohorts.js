"use strict";

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('cohorts').del().then(function () {
    return (// Inserts seed entries
      knex('cohorts').insert([{
        id: 1,
        name: 'London Class 7'
      }, {
        id: 2,
        name: 'London Class 8'
      }, {
        id: 3,
        name: 'West Midlands Class 2'
      }, {
        id: 4,
        name: 'West Midlands Class 3'
      }, {
        id: 5,
        name: 'Scotland Class 2'
      }, {
        id: 6,
        name: 'South Africa Class 1'
      }, {
        id: 7,
        name: 'Rome Class 8'
      }])
    );
  });
};