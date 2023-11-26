'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class customers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  customers.init({
    id_customer: {
      type : DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement:true
    },
    nama: DataTypes.STRING,
    nik: DataTypes.STRING,
    no_hp: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'customers',
    tableName: 'customers'
  });
  return customers;
};