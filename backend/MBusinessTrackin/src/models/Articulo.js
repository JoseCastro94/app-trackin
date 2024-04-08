import { DataTypes } from "sequelize"
import Sequelize from "sequelize"
import { sequelize } from "../database/database.js"
import { ArticuloNegocio } from './ArticuloNegocio.js'
import { Stock } from './Stock.js'
import { TransacAlmacen } from "./TransacAlmacen.js"
import { Incidente } from "./Incidente.js"
import { DetalleTransladoAlmacen } from "./DetalleTransladoAlmacen.js"
import { DetalleMovimientoMercancia } from "./DetalleMovimientoMercancia.js";
import { ControlSerie } from "./ControlSerie.js";
import { DetalleRelevoAlmacen } from './DetalleRelevoAlmacen.js'

export const Articulo = sequelize.define(
    "Articulos",
    {
        IdArticulo: {
            type: DataTypes.STRING,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        ItemCode: {
            type: DataTypes.STRING,
        },
        ItemName: {
            type: DataTypes.STRING(200),
        },
        Codebars: {
            type: DataTypes.STRING,
        },
        U_BPP_TIPUNMED: {
            type: DataTypes.STRING,
        },
        FotoAttach: {
            type: DataTypes.STRING,
        },
        FichaTecnicaAttach: {
            type: DataTypes.STRING,
        },
        MimeFichaTecnica: {
            type: DataTypes.TEXT,
        },
        Procedencia: {
            type: DataTypes.STRING,
            defaultValue: 'APP'
        },
        Activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
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

Articulo.hasMany(ArticuloNegocio, {
    foreignKey: "IdArticulo",
    sourceKey: "IdArticulo"
})

ArticuloNegocio.belongsTo(Articulo, {
    foreignKey: "IdArticulo",
    targetKey: "IdArticulo"
})

Articulo.hasMany(Stock, {
    foreignKey: "IdArticulo",
    sourceKey: "IdArticulo"
})

Stock.belongsTo(Articulo, {
    foreignKey: "IdArticulo",
    targetKey: "IdArticulo"
})

Articulo.hasMany(TransacAlmacen, {
    foreignKey: "IdArticulo",
    sourceKey: "IdArticulo"
})

TransacAlmacen.belongsTo(Articulo, {
    foreignKey: "IdArticulo",
    targetKey: "IdArticulo"
})

Articulo.hasMany(Incidente, {
    foreignKey: "IdArticulo",
    sourceKey: "IdArticulo"
})

Incidente.belongsTo(Articulo, {
    foreignKey: "IdArticulo",
    targetKey: "IdArticulo"
})

Articulo.hasMany(DetalleMovimientoMercancia, {
    foreignKey: "IdArticulo",
    sourceKey: "IdArticulo"
})

DetalleMovimientoMercancia.belongsTo(Articulo, {
    foreignKey: "IdArticulo",
    targetKey: "IdArticulo"
})

Articulo.hasMany(ControlSerie, {
    foreignKey: "IdArticulo",
    sourceKey: "IdArticulo"
})

ControlSerie.belongsTo(Articulo, {
    foreignKey: "IdArticulo",
    targetKey: "IdArticulo"
})

Articulo.hasMany(DetalleTransladoAlmacen, {
    foreignKey: "IdArticulo",
    sourceKey: "IdArticulo"
})

DetalleTransladoAlmacen.belongsTo(Articulo, {
    foreignKey: "IdArticulo",
    targetKey: "IdArticulo"
})

Articulo.hasMany(DetalleRelevoAlmacen, {
    foreignKey: "IdArticulo",
    sourceKey: "IdArticulo"
})

DetalleRelevoAlmacen.belongsTo(Articulo, {
    foreignKey: "IdArticulo",
    targetKey: "IdArticulo"
})
