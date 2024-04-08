import { DataTypes } from "sequelize"
import Sequelize from "sequelize"
import { sequelize } from "../database/database.js"

export const EstadoDetalle = sequelize.define(
    "EstadoDetalles",
    {
        IdEstado: {
            type: DataTypes.STRING,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        UsuarioCreacion: {
            type: DataTypes.STRING,
        },
        FechaCreacion: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW,
        },
        IdDetalleSolicitud: {
            type: DataTypes.STRING,
        },
        IdParametro: {
            type: DataTypes.STRING
        },
        IdDetalleSolicitudTransferencia: {
            type: DataTypes.STRING
        }
    },
    {
        timestamps: false,
    }
)