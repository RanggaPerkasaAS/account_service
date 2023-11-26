'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  account.init({
    id_account: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: false
    },
    id_customer: DataTypes.INTEGER,
    saldo: DataTypes.INTEGER
  }, {
    sequelize,
    tableName: 'account',
    modelName: 'account',
  });
  return account;
};