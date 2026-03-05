'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('concert_songs', {
      concert_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'concerts',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      song_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'songs',
          key: 'id',
        },
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
  },

  async down(queryInterface) {
    await queryInterface.dropTable('concert_songs')
  },
}
