'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class TagSchema extends Schema {
  up() {
    this.create('tags', table => {
      table.increments();
      table.string('tag_name');
      table.integer('tipo');
      table.integer('tendencia_id').unsigned();
      table
        .foreign('tendencia_id')
        .references('tendencias.id')
        .onDelete('cascade');
    });
  }

  down() {
    this.drop('tags');
  }
}

module.exports = TagSchema;
