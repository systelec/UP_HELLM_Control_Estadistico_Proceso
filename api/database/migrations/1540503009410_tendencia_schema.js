'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class TendenciaSchema extends Schema {
  up() {
    this.create('tendencias', table => {
      table.increments('id');
      table.string('nombre');
      table.string('tag');
      table.string('tipo');
      table.string('descripcion');
      table.datetime('ultima_actualizacion').defaultTo(this.fn.now());
      table.boolean('dosificacion').defaultTo(false);
      table.boolean('tv').defaultTo(false);
      table.boolean('tiempo_real').defaultTo(false);
    });
  }

  down() {
    this.drop('tendencias');
  }
}

module.exports = TendenciaSchema;
