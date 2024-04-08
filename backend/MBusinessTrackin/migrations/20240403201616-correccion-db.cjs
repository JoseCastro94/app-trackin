'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {


    await queryInterface.addColumn('DetalleSolicitudTransferencia', 'IdNegocio', {
      type: Sequelize.STRING,
      allowNull: true
    });

    // Añadir relaciones
    await queryInterface.addConstraint('DetalleSolicitudTransferencia', {
      fields: ['IdUsuarioNegocio'],
      type: 'foreign key',
      name: 'FK_DetalleSolicitudTransferencia_UsuarioNegocios',
      references: {
        table: 'UsuarioNegocios',
        field: 'IdUsuarioNegocio'
      },
      onDelete: 'CASCADE',
    });

    await queryInterface.addConstraint('DetalleSolicitudTransferencia', {
      fields: ['IdAlmacen'],
      type: 'foreign key',
      name: 'FK_DetalleSolicitudTransferencia_Almacenes',
      references: {
        table: 'Almacenes',
        field: 'IdAlmacen'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });


    await queryInterface.addConstraint('DetalleSolicitudTransferencia', {
      fields: ['IdNegocio'],
      type: 'foreign key',
      name: 'FK_DetalleSolicitudTransferencia_TipoNegocios',
      references: {
        table: 'TipoNegocios',
        field: 'IdNegocio'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Eliminar relaciones
    await queryInterface.removeConstraint('DetalleSolicitudTransferencia', 'FK_DetalleSolicitudTransferencia_UsuarioNegocios');
    await queryInterface.removeConstraint('DetalleSolicitudTransferencia', 'FK_DetalleSolicitudTransferencia_Almacenes');
    await queryInterface.removeConstraint('DetalleSolicitudTransferencia', 'FK_DetalleSolicitudTransferencia_TipoNegocios');

    // Deshacer los cambios de columnas
    await queryInterface.removeColumn('DetalleSolicitudTransferencia', 'IdAlmacen');
    await queryInterface.removeColumn('DetalleSolicitudTransferencia', 'IdNegocio');
  }
};
