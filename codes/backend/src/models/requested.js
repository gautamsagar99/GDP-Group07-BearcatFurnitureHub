// models/requested.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { User } = require("./user"); // Import the User model
const { Furniture } = require("./furniture"); // Import the Furniture model

const Requested = sequelize.define(
  "requested",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    furniture_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Furniture,
        key: "id",
      },
    },
    request_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Set a default value to the current date and time
    },
  },
  {
    timestamps: false, // Disable timestamps
    tableName: "requested", 
  }
);

module.exports = {
  Requested,
};
