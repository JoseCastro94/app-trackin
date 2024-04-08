import { DataTypes } from "sequelize"
import { sequelize } from "../database/database.js"
import Sequelize from "sequelize"
import { EstadoDetalle } from "./EstadoDetalle.js"
import { TransacAlmacen } from "./TransacAlmacen.js";
import { DetalleDespachoSolicitud } from "./DetalleDespachoSolicitud.js"

export const DetalleSolicitudArticulo = sequelize.define(
    "DetalleSolicitudArticulos",
    {
        IdDetalleSocilitud: {
            type: DataTypes.STRING,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
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
        CCosto: {
            type: DataTypes.STRING,
        },
        CodigoCCosto: {
            type: DataTypes.STRING,
        },
        U_MSSL_GRPART: {
            type: DataTypes.STRING,
        },
        Name: {
            type: DataTypes.STRING,
        },
        U_BPP_TIPUNMED: {
            type: DataTypes.STRING,
        },
        U_BPP_DEVOL: {
            type: DataTypes.STRING,
        },
        SerialNumber: {
            type: DataTypes.STRING(50),
        },
        Observacion: {
            type: DataTypes.STRING,
        },
        UsuarioCreacion: {
            type: DataTypes.STRING,
        },
        FechaCreacion: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW,
        },
        UsuarioModifica: {
            type: DataTypes.STRING,
        },
        FechaModifica: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW,
        }
    },
    {
        timestamps: false,
        hooks: {
            afterCreate: (detail, options) => {
                EstadoDetalle.create({
                    UsuarioCreacion: detail.UsuarioCreacion,
                    IdDetalleSolicitud: detail.IdDetalleSocilitud,
                    IdParametro: detail.IdEstado
                }).then()
            },
            afterUpdate: (detail, options) => {
                if (detail._changed.has('IdEstado')) {
                    EstadoDetalle.create({
                        UsuarioCreacion: detail.UsuarioModifica,
                        IdDetalleSolicitud: detail.IdDetalleSocilitud,
                        IdParametro: detail.IdEstado
                    }).then()
                }
            },
            afterUpsert: (details, options) => {
                details.forEach(detail => {
                    EstadoDetalle.create({
                        UsuarioCreacion: detail.UsuarioModifica,
                        IdDetalleSolicitud: detail.IdDetalleSocilitud,
                        IdParametro: detail.IdEstado
                    }).then()
                })
            },
        }
    }
)
/*
DetalleSolicitudArticulo.hasMany(DespachoSolicitud, {
    foreignKey: "IdDetalleSocilitud",
    sourceKey: "IdDetalleSocilitud"
})

DespachoSolicitud.belongsTo(DetalleSolicitudArticulo, {
    foreignKey: "IdDetalleSocilitud",
    targetKey: "IdDetalleSocilitud"
})
*/
DetalleSolicitudArticulo.hasMany(DetalleDespachoSolicitud, {
    foreignKey: "IdDetalleSolicitud",
    sourceKey: "IdDetalleSocilitud"
})

DetalleDespachoSolicitud.belongsTo(DetalleSolicitudArticulo, {
    foreignKey: "IdDetalleSolicitud",
    targetKey: "IdDetalleSocilitud"
})

DetalleSolicitudArticulo.hasMany(TransacAlmacen, {
    foreignKey: "IdDetalleSolicitud",
    sourceKey: "IdDetalleSocilitud"
})

TransacAlmacen.belongsTo(DetalleSolicitudArticulo, {
    foreignKey: "IdDetalleSolicitud",
    targetKey: "IdDetalleSocilitud"
})

DetalleSolicitudArticulo.hasMany(EstadoDetalle, {
    foreignKey: "IdDetalleSolicitud",
    sourceKey: "IdDetalleSocilitud"
})

EstadoDetalle.belongsTo(DetalleSolicitudArticulo, {
    foreignKey: "IdDetalleSolicitud",
    targetKey: "IdDetalleSocilitud"
})