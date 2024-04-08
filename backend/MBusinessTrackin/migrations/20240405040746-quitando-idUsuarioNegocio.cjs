'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Eliminar la relación de clave externa en DetalleSolicitudTransferencia
    await queryInterface.removeConstraint('DetalleSolicitudTransferencia', 'FK_DetalleSolicitudTransferencia_UsuarioNegocios');
    
    // Eliminar la columna IdUsuarioNegocio en DetalleSolicitudTransferencia
    await queryInterface.removeColumn('DetalleSolicitudTransferencia', 'IdUsuarioNegocio');
  },

  async down(queryInterface, Sequelize) {
    // Añadir la columna IdUsuarioNegocio en DetalleSolicitudTransferencia
    await queryInterface.addColumn('DetalleSolicitudTransferencia', 'IdUsuarioNegocio', {
      type: Sequelize.INTEGER,
      allowNull: false, // Ajusta esto según sea necesario
      references: {
        model: 'UsuarioNegocios',
        key: 'IdUsuarioNegocio'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    // Restaurar la relación de clave externa en DetalleSolicitudTransferencia
    await queryInterface.addConstraint('DetalleSolicitudTransferencia', {
      fields: ['IdUsuarioNegocio'],
      type: 'foreign key',
      name: 'FK_DetalleSolicitudTransferencia_UsuarioNegocios',
      references: {
        table: 'UsuarioNegocios',
        field: 'IdUsuarioNegocio'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  }
};
