const path = require('path')

module.exports = {
  development: {
    dialect: 'sqlite',
    storage: path.join(__dirname, '../..', 'database.sqlite'),
    define: {
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
  production: {
    dialect: 'sqlite',
    storage: path.join(__dirname, '../..', 'database.sqlite'),
    define: {
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
}
