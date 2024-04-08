import { DataTypes } from "sequelize"
import Sequelize from "sequelize"
import { sequelize } from "../database/database.js"
import { UsuarioAlmacen } from './UsuarioAlmacen.js'
import { DespachoSolicitud } from "./DespachoSolicitud.js"
import { DetalleSolicitudArticulo } from "./DetalleSolicitudArticulo.js"
import { Stock } from './Stock.js'
import { TransacAlmacen } from "./TransacAlmacen.js"
import { Incidente } from "./Incidente.js"
import { TransladoAlmacen } from "./TransladoAlmacen.js"
import { MovimientoMercancia } from "./MovimientoMercancia.js";
import { ControlSerie } from "./ControlSerie.js";
import { RelevoAlmacen } from './RelevoAlmacen.js'
import { DetalleRelevoAlmacen } from './DetalleRelevoAlmacen.js'

export const Almacen = sequelize.define(
    "Almacenes",
    {
        IdAlmacen: {
            type: DataTypes.STRING,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        Nombre: {
            type: DataTypes.STRING,
        },
        Descripcion: {
            type: DataTypes.STRING,
        },
        Direccion: {
            type: DataTypes.STRING,
        },
        Activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        Tipo: {
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
    }
)

Almacen.hasMany(UsuarioAlmacen, {
    foreignKey: "IdAlmacen",
    sourceKey: "IdAlmacen"
})

UsuarioAlmacen.belongsTo(Almacen, {
    foreignKey: "IdAlmacen",
    targetKey: "IdAlmacen"
})

Almacen.hasMany(DespachoSolicitud, {
    foreignKey: "IdAlmacen",
    sourceKey: "IdAlmacen"
})

DespachoSolicitud.belongsTo(Almacen, {
    foreignKey: "IdAlmacen",
    targetKey: "IdAlmacen"
})

Almacen.hasMany(Stock, {
    foreignKey: "IdAlmacen",
    sourceKey: "IdAlmacen"
})

Stock.belongsTo(Almacen, {
    foreignKey: "IdAlmacen",
    targetKey: "IdAlmacen"
})

Almacen.hasMany(DetalleSolicitudArticulo, {
    foreignKey: "IdAlmacen",
    sourceKey: "IdAlmacen"
})

DetalleSolicitudArticulo.belongsTo(Almacen, {
    foreignKey: "IdAlmacen",
    sourceKey: "IdAlmacen"
})

Almacen.hasMany(TransacAlmacen, {
    foreignKey: "IdAlmacenOrigen",
    sourceKey: "IdAlmacen"
})

TransacAlmacen.belongsTo(Almacen, {
    foreignKey: "IdAlmacenOrigen",
    targetKey: "IdAlmacen"
})

Almacen.hasMany(TransacAlmacen, {
    foreignKey: "IdAlmacenDestino",
    sourceKey: "IdAlmacen"
})

TransacAlmacen.belongsTo(Almacen, {
    foreignKey: "IdAlmacenDestino",
    targetKey: "IdAlmacen"
})

Almacen.hasMany(Incidente, {
    foreignKey: "IdAlmacen",
    sourceKey: "IdAlmacen"
})

Incidente.belongsTo(Almacen, {
    foreignKey: "IdAlmacen",
    targetKey: "IdAlmacen"
})

Almacen.hasMany(MovimientoMercancia, {
    foreignKey: "IdAlmacen",
    sourceKey: "IdAlmacen"
})

MovimientoMercancia.belongsTo(Almacen, {
    foreignKey: "IdAlmacen",
    targetKey: "IdAlmacen"
})

Almacen.hasMany(ControlSerie, {
    foreignKey: "IdAlmacen",
    sourceKey: "IdAlmacen"
})

ControlSerie.belongsTo(Almacen, {
    foreignKey: "IdAlmacen",
    targetKey: "IdAlmacen"
})

Almacen.hasMany(TransladoAlmacen, {
    foreignKey: "IdAlmacenOrigen",
    sourceKey: "IdAlmacen",
    as: 'AlmacenOrigen',
})

TransladoAlmacen.belongsTo(Almacen, {
    foreignKey: "IdAlmacenOrigen",
    targetKey: "IdAlmacen",
    as: 'AlmacenOrigen',
})

Almacen.hasMany(TransladoAlmacen, {
    foreignKey: "IdAlmacenDestino",
    sourceKey: "IdAlmacen",
    as: 'AlmacenDestino',
})

TransladoAlmacen.belongsTo(Almacen, {
    foreignKey: "IdAlmacenDestino",
    targetKey: "IdAlmacen",
    as: 'AlmacenDestino',
})

Almacen.hasMany(RelevoAlmacen, {
    foreignKey: "IdAlmacen",
    sourceKey: "IdAlmacen"
})

RelevoAlmacen.belongsTo(Almacen, {
    foreignKey: "IdAlmacen",
    targetKey: "IdAlmacen"
})

Almacen.hasMany(DetalleRelevoAlmacen, {
    foreignKey: "IdAlmacen",
    sourceKey: "IdAlmacen"
})

DetalleRelevoAlmacen.belongsTo(Almacen, {
    foreignKey: "IdAlmacen",
    targetKey: "IdAlmacen"
})