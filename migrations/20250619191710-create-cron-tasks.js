module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('cron_tasks', {
      id: {
        type: 'SERIAL',
        primaryKey: true,
      },
      name: {
        type: 'VARCHAR(255)',
        allowNull: false,
      },
      status: {
        type: 'VARCHAR(50)',
        allowNull: false,
      },
      app_instance_id: {
        type: 'VARCHAR(255)',
        allowNull: true,
      },
      started_at: {
        type: 'TIMESTAMP',
        allowNull: true,
      },
      finished_at: {
        type: 'TIMESTAMP',
        allowNull: true,
      },
      created_at: {
        type: 'TIMESTAMP',
        allowNull: false,
        defaultValue: queryInterface.sequelize.literal('NOW()'),
      },
      updated_at: {
        type: 'TIMESTAMP',
        allowNull: false,
        defaultValue: queryInterface.sequelize.literal('NOW()'),
      },
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('cron_tasks');
  },
};

