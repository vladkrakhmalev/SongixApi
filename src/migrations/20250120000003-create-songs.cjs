'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('songs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      text: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      collection_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'collections',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })

    await queryInterface.addIndex('songs', ['collection_id'])
    await queryInterface.addIndex('songs', ['created_at'])
    await queryInterface.addIndex('songs', ['title'])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('songs')
  },
}
