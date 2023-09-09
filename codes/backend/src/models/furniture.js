// models/furniture.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Furniture = sequelize.define(
  "furniture",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    furniture_condition: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    years_used: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    furniture_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false, // Disable timestamps
  }
);

module.exports = {
  Furniture,
};
