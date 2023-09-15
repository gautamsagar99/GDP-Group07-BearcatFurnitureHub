// models/furniture.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { User } = require("./user"); // Import the User model

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
    furniture_description: {
      type: DataTypes.TEXT, // Use TEXT data type for longer descriptions
      allowNull: true,
    },
    Donated_date: {
      type: DataTypes.DATE, // Use DATE data type for date values
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "available", // Set a default status value (e.g., "available")
    },
  },
  {
    timestamps: false, // Disable timestamps
  }
);

module.exports = {
  Furniture,
};
