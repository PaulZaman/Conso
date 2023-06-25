const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');
const Banker = require('./BankerModel');
const LoanApplication = require('./LoanApplicationModel');

const Offer = sequelize.define('Offer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  banker_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Banker,
      key: 'id',
    },
  },
  loan_application_id: {
    type: DataTypes.INTEGER,
    references: {
      model: LoanApplication,
      key: 'id',
    },
  },
  interest_rate: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  date_posted: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  }
});
module.exports = Offer; 