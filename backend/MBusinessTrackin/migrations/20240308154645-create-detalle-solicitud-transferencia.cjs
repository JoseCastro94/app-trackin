'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('DetalleSolicitudTransferencia', 'IdSolicitud', {
      type: Sequelize.STRING,
      allowNull: false, // Puedes ajustar esto según tus necesidades
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('DetalleSolicitudTransferencia', 'IdSolicitud');
  },
};
