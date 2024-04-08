import { DataTypes } from "sequelize"
import Sequelize from "sequelize"
import { sequelize } from "../database/database.js"
import { TransferenciaAdjunto } from './TransferenciaAdjunto.js'

export const DetalleTransladoAlmacen = sequelize.define(
    "DetalleTransladoAlmacenes",
    {
        IdDetalleTranslado: {
            type: DataTypes.STRING,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        FechaTranslado: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW,
        },
        FechaRecepcion: {
            type: DataTypes.DATE,
        },
        ItemCode: {
            type: DataTypes.STRING,
        },
        ItemName: {
            type: DataTypes.STRING,
        },
        Grupo: {
            type: DataTypes.STRING,
        },
        U_BPP_TIPUNMED: {
            type: DataTypes.STRING,
        },
        CodeBars: {
            type: DataTypes.STRING,
        },
        CantidadEnviada: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        CantidadRecibida: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        Importe: {
            type: DataTypes.DECIMAL,
            defaultValue: 0
        },
        Observacion: {
            type: DataTypes.STRING,
            defaultValue: ''
        },
        SerialNumber: {
            type: DataTypes.STRING,
        },        
        TipoStock: {
            type: DataTypes.STRING,
            defaultValue: ''
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
    }
)

DetalleTransladoAlmacen.hasMany(TransferenciaAdjunto, {
    foreignKey: "IdDetalleTranslado",
    sourceKey: "IdDetalleTranslado"
})

TransferenciaAdjunto.belongsTo(DetalleTransladoAlmacen, {
    foreignKey: "IdDetalleTranslado",
    targetKey: "IdDetalleTranslado"
})