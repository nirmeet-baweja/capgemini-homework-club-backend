"use strict";

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('skills').del().then(function () {
    return (// Inserts seed entries
      knex('skills').insert([{
        id: 1,
        name: 'Git and Github'
      }, {
        id: 2,
        name: 'HTML'
      }, {
        id: 3,
        name: 'CSS'
      }, {
        id: 4,
        name: 'Javascript'
      }, {
        id: 5,
        name: 'React'
      }, {
        id: 6,
        name: 'Node.js'
      }, {
        id: 7,
        name: 'Databases - SQL'
      }, {
        id: 8,
        name: 'Databases - No SQL'
      }, {
        id: 9,
        name: 'Personal Development'
      }])
    );
  });
};