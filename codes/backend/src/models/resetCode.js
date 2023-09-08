// src/models/resetCode.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ResetCode = sequelize.define(
  "resetCodes",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    timestamps: false, // Disable timestamps
  }
);

module.exports = ResetCode;
//resetCode.js