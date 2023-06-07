'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class favorite extends Model {
    static associate(models) {
      favorite.belongsTo(models.user);
      favorite.belongsTo(models.pokemon);
    }
  }
  favorite.init({
    userId: DataTypes.INTEGER,
    pokemonId: DataTypes.STRING,
    name: DataTypes.INTEGER,

  }, {
    sequelize,
    modelName: 'favorite',
    tableName: 'favorites',
  });
  return favorite;
};
