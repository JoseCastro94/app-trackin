import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import Sequelize from "sequelize";
import { Estado } from './Estado.js';
import { DetalleSolicitudTransferencia } from "./DetalleSolicitudTransferencia.js";
import { DespachoSolicitud } from "./DespachoSolicitud.js";
import { Almacen } from "./Almacen.js";
import { Usuario } from "./Usuario.js";
 
export const SolicitudTransferencia = sequelize.define(
    "SolicitudTransferencia",
    {
        IdSolicitud: {
            type: DataTypes.STRING,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        Tipo: {
            type: DataTypes.STRING,
        },
        Periodo: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        Correlativo: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        FechaSolicitud: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW,
        },
        FechaPropuesta: {
            type: DataTypes.DATE,
        },
        MotivoSolicitud: {
            type: DataTypes.STRING,
        },
        UsuarioCreacion: {
            type: DataTypes.STRING,
        },
        FechaCreacion: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW,
        },
        IdAlmacenDestino: {
            type: DataTypes.STRING,
        },
        IdAlmacenOrigen: {
            type: DataTypes.STRING
        },
        IdUsuarioDestino: {
            type: DataTypes.STRING
        },
        IdEmpresa: {
            type: DataTypes.STRING
        },
        IdEstado: {
            type: DataTypes.STRING
        }
    },
    {
        timestamps: false,
        indexes: [
            {
                fields: ['IdUsuarioDestino']
            }
        ],
        hooks: {
            afterCreate: (head, options) => {
                Estado.create({
                    UsuarioCreacion: head.UsuarioCreacion,
                    IdTransferencia: head.IdSolicitud,
                    IdParametro: head.IdEstado,
                    Tipo: head.Tipo,
                }).then();
            },
            afterUpdate: (head, options) => {
                if (head._changed.has('IdEstado')) {
                    Estado.create({
                        UsuarioCreacion: head.UsuarioModifica,
                        IdTransferencia: head.IdSolicitud,
                        IdParametro: head.IdEstado,
                        Tipo: head.Tipo ?? 'PEDIDO',
                    }).then();
                }
            },
            afterUpsert: (heads, options) => {
                heads.forEach(head => {
                    Estado.create({
                        UsuarioCreacion: head.UsuarioModifica,
                        IdTransferencia: head.IdSolicitud,
                        IdParametro: head.IdEstado,
                        Tipo: head.Tipo ?? 'PEDIDO',
                    }).then();
                });
            },
        }
    }
);
 
// SolicitudTransferencia.hasMany(Estado, {
//     foreignKey: "IdSolicitud",
//     sourceKey: "IdSolicitud"
// })
 
 
Estado.belongsTo(SolicitudTransferencia, {
    foreignKey: 'IdTransferencia', // Campo de clave foránea en la tabla "Estados"
    targetKey: 'IdSolicitud'    // Campo de clave primaria en la tabla "SolicitudTransferencia"
});
 
SolicitudTransferencia.hasMany(DetalleSolicitudTransferencia, {
    foreignKey: "IdSolicitud",
    sourceKey: "IdSolicitud"
});
 
DetalleSolicitudTransferencia.belongsTo(SolicitudTransferencia, {
    foreignKey: "IdSolicitud",
    targetKey: "IdSolicitud"
});
 
SolicitudTransferencia.hasMany(DespachoSolicitud, {
    foreignKey: "IdSolicitud", // Corrected column name
    sourceKey: "IdSolicitud"   // Assuming it's also "IdSolicitud" in SolicitudTransferencia
})
 
DespachoSolicitud.belongsTo(SolicitudTransferencia, {
    foreignKey: "IdSolicitud",
    targetKey: "IdSolicitud"
})

SolicitudTransferencia.belongsTo(Almacen, { foreignKey: 'IdAlmacenDestino' });

SolicitudTransferencia.belongsTo(Usuario, { foreignKey: 'IdUsuarioDestino' });