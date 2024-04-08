import { DataTypes } from "sequelize"
import Sequelize from "sequelize"
import { sequelize } from "../database/database.js"
import { DetalleSolicitudArticulo } from './DetalleSolicitudArticulo.js'
import { ArticuloNegocio } from './ArticuloNegocio.js'
import { UsuarioNegocio } from './UsuarioNegocio.js'
import { Stock } from './Stock.js'
import { TransacAlmacen } from "./TransacAlmacen.js"
import { Incidente } from "./Incidente.js"
import { DetalleTransladoAlmacen } from "./DetalleTransladoAlmacen.js"
import { DetalleMovimientoMercancia } from "./DetalleMovimientoMercancia.js";
import { ControlSerie } from "./ControlSerie.js";
import { DetalleHistorialResponsableAlmacen } from "./DetalleHistorialResponsableAlmacen.js";
import { DetalleRelevoAlmacen } from './DetalleRelevoAlmacen.js';
import { GrupoArticulo } from './GrupoArticulo.js';

export const TipoNegocio = sequelize.define(
    "TipoNegocio",
    {
        IdNegocio: {
            type: DataTypes.STRING,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        Nombre: {
            type: DataTypes.STRING,
        },
        Tipo: {
            type: DataTypes.INTEGER,
        },
        SubTipo: {
            type: DataTypes.INTEGER,
        },
        Dim1: {
            type: DataTypes.STRING,
        },
        Dim2: {
            type: DataTypes.STRING,
        },
        Dim3: {
            type: DataTypes.STRING,
        },
        Dim4: {
            type: DataTypes.STRING,
        },
        Dim5: {
            type: DataTypes.STRING,
        },
        Activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
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
        },
         CodigoUnidad: {
            type: DataTypes.STRING,
         }
        
    },
    {
        timestamps: false,
    }
)

TipoNegocio.hasMany(DetalleSolicitudArticulo, {
    foreignKey: "IdNegocio",
    sourceKey: "IdNegocio"
})

DetalleSolicitudArticulo.belongsTo(TipoNegocio, {
    foreignKey: "IdNegocio",
    targetKey: "IdNegocio"
})

TipoNegocio.hasMany(ArticuloNegocio, {
    foreignKey: "IdNegocio",
    sourceKey: "IdNegocio"
})

ArticuloNegocio.belongsTo(TipoNegocio, {
    foreignKey: "IdNegocio",
    targetKey: "IdNegocio"
})

TipoNegocio.hasMany(UsuarioNegocio, {
    foreignKey: "IdNegocio",
    sourceKey: "IdNegocio"
})

UsuarioNegocio.belongsTo(TipoNegocio, {
    foreignKey: "IdNegocio",
    targetKey: "IdNegocio"
})

TipoNegocio.hasMany(Stock, {
    foreignKey: "IdNegocio",
    sourceKey: "IdNegocio"
})

Stock.belongsTo(TipoNegocio, {
    foreignKey: "IdNegocio",
    targetKey: "IdNegocio"
})

TipoNegocio.hasMany(TransacAlmacen, {
    foreignKey: "IdNegocio",
    sourceKey: "IdNegocio"
})

TransacAlmacen.belongsTo(TipoNegocio, {
    foreignKey: "IdNegocio",
    targetKey: "IdNegocio"
})

TipoNegocio.hasMany(Incidente, {
    foreignKey: "IdNegocio",
    sourceKey: "IdNegocio"
})

Incidente.belongsTo(TipoNegocio, {
    foreignKey: "IdNegocio",
    targetKey: "IdNegocio"
})

TipoNegocio.hasMany(DetalleMovimientoMercancia, {
    foreignKey: "IdNegocio",
    sourceKey: "IdNegocio"
})

DetalleMovimientoMercancia.belongsTo(TipoNegocio, {
    foreignKey: "IdNegocio",
    targetKey: "IdNegocio"
})

TipoNegocio.hasMany(ControlSerie, {
    foreignKey: "IdNegocio",
    sourceKey: "IdNegocio"
})

ControlSerie.belongsTo(TipoNegocio, {
    foreignKey: "IdNegocio",
    targetKey: "IdNegocio"
})

TipoNegocio.hasMany(DetalleTransladoAlmacen, {
    foreignKey: "IdNegocio",
    sourceKey: "IdNegocio"
})

DetalleTransladoAlmacen.belongsTo(TipoNegocio, {
    foreignKey: "IdNegocio",
    targetKey: "IdNegocio"
})

TipoNegocio.hasMany(DetalleHistorialResponsableAlmacen, {
    foreignKey: "IdNegocio",
    sourceKey: "IdNegocio"
})

DetalleHistorialResponsableAlmacen.belongsTo(TipoNegocio, {
    foreignKey: "IdNegocio",
    targetKey: "IdNegocio"
})

TipoNegocio.hasMany(DetalleRelevoAlmacen, {
    foreignKey: "IdNegocio",
    sourceKey: "IdNegocio"
})

DetalleRelevoAlmacen.belongsTo(TipoNegocio, {
    foreignKey: "IdNegocio",
    targetKey: "IdNegocio"
})

TipoNegocio.hasMany(GrupoArticulo, {
    foreignKey: "IdNegocio",
    sourceKey: "IdNegocio"
})

GrupoArticulo.belongsTo(TipoNegocio, {
    foreignKey: "IdNegocio",
    targetKey: "IdNegocio"
})