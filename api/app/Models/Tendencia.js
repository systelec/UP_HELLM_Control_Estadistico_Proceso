'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Tendencia extends Model {
  static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
    return null;
  }

  tags() {
    return this.hasMany('App/Models/Tag');
  }

  limites() {
    return this.hasMany('App/Models/Limite');
  }

  historicos() {
    return this.hasMany('App/Models/Historico');
  }
}

module.exports = Tendencia;
