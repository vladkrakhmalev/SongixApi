'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'google_id', {
      type: Sequelize.STRING,
      allowNull: true,
    })

    await queryInterface.addIndex('users', ['google_id'], {
      unique: true,
      name: 'users_google_id_unique',
    })

    await queryInterface.changeColumn('users', 'password', {
      type: Sequelize.STRING,
      allowNull: true,
    })
  },

  async down(queryInterface, Sequelize) {
    const [results] = await queryInterface.sequelize.query(
      'SELECT COUNT(*) as count FROM users WHERE password IS NULL'
    )
    const count = parseInt(results[0]?.count || 0, 10)

    if (count > 0) {
      throw new Error(
        `Cannot rollback migration: ${count} user(s) exist with NULL passwords (Google-only accounts). ` +
          'Please delete these users or set passwords for them before rolling back this migration.'
      )
    }

    await queryInterface.changeColumn('users', 'password', {
      type: Sequelize.STRING,
      allowNull: false,
    })

    await queryInterface.removeIndex('users', 'users_google_id_unique')
    await queryInterface.removeColumn('users', 'google_id')
  },
}
