'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class pokemon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  pokemon.init({
    name: DataTypes.STRING,
    url: DataTypes.STRING,
    base: DataTypes.STRING,
    image: DataTypes.STRING,
    pokeType1: DataTypes.STRING,
    pokeType2: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'pokemon',
  });
  return pokemon;
};