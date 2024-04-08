import { DataTypes } from "sequelize"
import { sequelize } from "../database/database.js"
import Sequelize from "sequelize"
import { DetalleSolicitudArticulo } from './DetalleSolicitudArticulo.js'
import { Estado } from './Estado.js'
import { DespachoSolicitud } from "./DespachoSolicitud.js";

export const SolicitudArticulo = sequelize.define(
    "SolicitudArticulos",
    {
        IdSocilitud: {
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
        Estado: {
            type: DataTypes.STRING(36),
        },
        FechaSolicitud: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW,
        },
        FechaEntrega: {
            type: DataTypes.DATE,
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
        indexes: [
            {
                fields: ['IdUsuarioSolicita']
            }
        ],
        hooks: {
            afterCreate: (head, options) => {
                Estado.create({
                    UsuarioCreacion: head.UsuarioCreacion,
                    IdSocilitud: head.IdSocilitud,
                    IdParametro: head.IdEstado,
                    Tipo: head.Tipo,
                }).then()
            },
            afterUpdate: (head, options) => {
                if (head._changed.has('IdEstado')) {
                    Estado.create({
                        UsuarioCreacion: head.UsuarioModifica,
                        IdSocilitud: head.IdSocilitud,
                        IdParametro: head.IdEstado,
                        Tipo: head.Tipo ?? 'PEDIDO',
                    }).then()
                }
            },
            afterUpsert: (heads, options) => {
                heads.forEach(head => {
                    Estado.create({
                        UsuarioCreacion: head.UsuarioModifica,
                        IdSocilitud: head.IdSocilitud,
                        IdParametro: head.IdEstado,
                        Tipo: head.Tipo ?? 'PEDIDO',
                    }).then()
                })
            },
        }
    },
)

SolicitudArticulo.hasMany(DetalleSolicitudArticulo, {
    foreignKey: "IdSocilitud",
    sourceKey: "IdSocilitud"
})

DetalleSolicitudArticulo.belongsTo(SolicitudArticulo, {
    foreignKey: "IdSocilitud",
    targetKey: "IdSocilitud"
})

SolicitudArticulo.hasMany(Estado, {
    foreignKey: "IdSocilitud",
    sourceKey: "IdSocilitud"
})

Estado.belongsTo(SolicitudArticulo, {
    foreignKey: "IdSocilitud",
    targetKey: "IdSocilitud"
})

SolicitudArticulo.hasMany(DespachoSolicitud, {
    foreignKey: "IdSocilitud",
    sourceKey: "IdSocilitud"
})

DespachoSolicitud.belongsTo(SolicitudArticulo, {
    foreignKey: "IdSocilitud",
    targetKey: "IdSocilitud"
})