import { DataTypes } from "sequelize"
import Sequelize from "sequelize"
import { sequelize } from "../database/database.js"
import { DetalleRelevoAlmacen } from './DetalleRelevoAlmacen.js'

export const Stock = sequelize.define(
    "Stocks",
    {
        IdStock: {
            type: DataTypes.STRING,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        Cantidad: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        Tipo: {
            type: DataTypes.STRING,
            defaultValue: 'DISPONIBLE'
        },
    },
    {
        timestamps: true,
    }
)

Stock.hasMany(DetalleRelevoAlmacen, {
    foreignKey: "IdStock",
    sourceKey: "IdStock"
})

DetalleRelevoAlmacen.belongsTo(Stock, {
    foreignKey: "IdStock",
    targetKey: "IdStock"
})