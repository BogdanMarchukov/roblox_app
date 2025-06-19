module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('users', {
      id: {
        type: 'SERIAL',
        primaryKey: true,
      },
      balance: {
        type: 'INTEGER',
        allowNull: false,
      },
    });

    await queryInterface.bulkInsert('users', [
      {
        balance: 10000,
      },
    ]);
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('users');
  },
};

