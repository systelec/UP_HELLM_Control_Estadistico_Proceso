'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class TanqueSchema extends Schema {
  up() {
    this.create('tanques', table => {
      table.increments();
      table.integer('numero');
      table.string('nombre');
      table.string('descripcion');
    });
  }

  down() {
    this.drop('tanques');
  }
}

module.exports = TanqueSchema;
