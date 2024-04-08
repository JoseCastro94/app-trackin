import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
 
import { EstadoDetalle } from "./EstadoDetalle.js"
import { TransacAlmacen } from "./TransacAlmacen.js";
import { DetalleDespachoSolicitud } from "./DetalleDespachoSolicitud.js";
 
export const DetalleSolicitudTransferencia = sequelize.define(
    "DetalleSolicitudTransferencia",
    {
        IdDetalleSolicitud: {
            type: DataTypes.STRING,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        ItemCode: {
            type: DataTypes.STRING,
        },
        ItemName: {
            type: DataTypes.STRING,
        },
        Cantidad: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        CantidadProgramada: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        Estado: {
            type: DataTypes.STRING,
        },
        U_MSSL_GRPART: {
            type: DataTypes.STRING,
        },
        U_BPP_TIPUNMED: {
            type: DataTypes.STRING,
        },
        U_BPP_DEVOL: {
            type: DataTypes.STRING,
        },
        UsuarioCreacion: {
            type: DataTypes.STRING,
        },
        FechaCreacion: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        IdUsuarioNegocioDestino: {
            type: DataTypes.STRING,
        },
        IdUsuarioDestino: {
            type: DataTypes.STRING,
        },
        IdNegocio: {
            type: DataTypes.STRING
        },
        IdEstado: {
            type: DataTypes.STRING
        },
        IdAlmacen: {
            type: DataTypes.STRING
        },
        IdArticuloNegocio: {
            type: DataTypes.STRING
        },
        IdUsuarioNegocio: {
            type: DataTypes.STRING
        }
 
    },
    {
        timestamps: false,
        hooks: {
            afterCreate: (detail, options) => {
                EstadoDetalle.create({
                    UsuarioCreacion: detail.UsuarioCreacion,
                    IdDetalleSolicitudTransferencia: detail.IdDetalleSolicitud,
                    IdParametro: detail.IdEstado,
                }).then()
            },
            afterUpdate: (detail, options) => {
                if (detail._changed.has('IdEstado')) {
                    EstadoDetalle.create({
                        UsuarioCreacion: detail.UsuarioModifica,
                        IdDetalleSolicitudTransferencia: detail.IdDetalleSolicitud,
                        IdParametro: detail.IdEstado,
                    }).then()
                }
            },
            afterUpsert: (details, options) => {
                details.forEach(detail => {
                    EstadoDetalle.create({
                        UsuarioCreacion: detail.UsuarioModifica,
                        IdDetalleSolicitudTransferencia: detail.IdDetalleSolicitud,
                        IdParametro: detail.IdEstado,
                    }).then()
                })
            },
        }
    }
);
 
DetalleSolicitudTransferencia.hasMany(DetalleDespachoSolicitud, {
    foreignKey: "IdDetalleSolicitud",
    sourceKey: "IdDetalleSolicitud"
})
 
DetalleDespachoSolicitud.belongsTo(DetalleSolicitudTransferencia, {
    foreignKey: "IdDetalleSolicitud",
    targetKey: "IdDetalleSolicitud"
})
 
DetalleSolicitudTransferencia.hasMany(TransacAlmacen, {
    foreignKey: "IdDetalleSolicitud",
    sourceKey: "IdDetalleSolicitud"
})
 
TransacAlmacen.belongsTo(DetalleSolicitudTransferencia, {
    foreignKey: "IdDetalleSolicitud",
    targetKey: "IdDetalleSolicitud"
})
 
DetalleSolicitudTransferencia.hasMany(EstadoDetalle, {
    foreignKey: 'IdDetalleSolicitudTransferencia',
    targetKey: 'IdDetalleSolicitud', // Deshabilita la restricción de clave externa para esta relación
});
 
EstadoDetalle.belongsTo(DetalleSolicitudTransferencia, {
    foreignKey: "IdDetalleSolicitudTransferencia",
    targetKey: "IdDetalleSolicitud"
})