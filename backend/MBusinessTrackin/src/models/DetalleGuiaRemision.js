import { DataTypes } from "sequelize"
import Sequelize from "sequelize"
import { sequelize } from "../database/database.js"

export const DetalleGuiaRemision = sequelize.define(
    "DetalleGuiaRemision",
    {
        IdDetalleGuiaRemision: {
            type: DataTypes.STRING,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        Fila: {
            type: DataTypes.INTEGER(10),
        },
        CorrelativoDoc: {
            type: DataTypes.STRING(40),
        },
        TipoDoc: {
            type: DataTypes.STRING(40),
        },
        NumPlacaVehiculo: {
            type: DataTypes.STRING(40),
        },
        NumContenedor: {
            type: DataTypes.STRING(40),
        },
        Items: {
            type: DataTypes.STRING(40),
        },
        UnidadMedida: {
            type: DataTypes.STRING(40),
        },
        DesUnidadMedida: {
            type: DataTypes.STRING(40),
        },
        CantidadItems: {
            type: DataTypes.INTEGER(10),
        },
        DetalleItems: {
            type: DataTypes.STRING(200),
        },
        SKUProd: {
            type: DataTypes.STRING(40),
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