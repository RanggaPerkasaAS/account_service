'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  transaction.init({
    id_transaction: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_account: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    kode_transaksi: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'transactions',
    modelName: 'transactions',
  });
  return transaction;
};