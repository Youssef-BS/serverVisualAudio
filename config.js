const { Sequelize } = require('sequelize');

// Initialize Sequelize instance
const sequelize = new Sequelize('E-Shop', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
 
});

module.exports = sequelize;
