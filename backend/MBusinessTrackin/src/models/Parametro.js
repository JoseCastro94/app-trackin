import {DetalleMovimientoMercancia} from "./DetalleMovimientoMercancia.js";
import { DetalleDespachoSolicitud } from "./DetalleDespachoSolicitud.js";
import { DetalleSolicitudArticulo } from "./DetalleSolicitudArticulo.js"
import { MovimientoMercancia } from "./MovimientoMercancia.js";
import { EvaluacionArticulo } from "./EvaluacionArticulo.js"
import { DespachoSolicitud } from "./DespachoSolicitud.js";
import { SolicitudArticulo } from "./SolicitudArticulo.js"
import { TransladoAlmacen } from "./TransladoAlmacen.js"
import { sequelize } from "../database/database.js"
import { EstadoDetalle } from "./EstadoDetalle.js"
import { RelevoAlmacen } from './RelevoAlmacen.js'
import { ControlSerie } from "./ControlSerie.js"
import { Incidente } from "./Incidente.js"
import { Articulo } from "./Articulo.js";
import { DataTypes } from "sequelize"
import { Estado } from "./Estado.js"
import Sequelize from "sequelize"
import { SolicitudTransferencia } from "./SolicitudTransferencia.js";
 
export const Parametro = sequelize.define(
    "Parametros",
    {
        IdParametro: {
            primaryKey: true,
            type: DataTypes.STRING,
            defaultValue: Sequelize.UUIDV4
        },
        Nombre: {
            type: DataTypes.STRING(50),
        },
        Descripcion: {
            type: DataTypes.STRING(100),
        },
        Valor1: {
            type: DataTypes.STRING(100),
        },
        Valor2: {
            type: DataTypes.STRING(100),
        },
        Activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        UsuarioCreacion: {
            type: DataTypes.STRING(36),
        },
        FechaCreacion: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW,
        },
        UsuarioModifica: {
            type: DataTypes.STRING(36),
        },
        FechaModifica: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW,
        },
        IdParametroPadre: {
            type: DataTypes.STRING(36),
        },
    },
    {
        timestamps: false,
    }
)
 
Parametro.hasMany(SolicitudArticulo, {
    foreignKey: "IdEstado",
    sourceKey: "IdParametro"
})
 
Parametro.hasMany(SolicitudTransferencia, {
    foreignKey: "IdEstado",
    sourceKey: "IdParametro"
})
 
SolicitudTransferencia.belongsTo(Parametro, {
    foreignKey: "IdEstado",
    targetKey: "IdParametro"
})
 
SolicitudArticulo.belongsTo(Parametro, {
    foreignKey: "IdEstado",
    targetKey: "IdParametro"
})
 
Parametro.hasMany(DetalleSolicitudArticulo, {
    foreignKey: "IdEstado",
    sourceKey: "IdParametro"
})
 
DetalleSolicitudArticulo.belongsTo(Parametro, {
    foreignKey: "IdEstado",
    targetKey: "IdParametro"
})
 
Parametro.hasMany(DespachoSolicitud, {
    foreignKey: "IdEstado",
    sourceKey: "IdParametro"
})
 
DespachoSolicitud.belongsTo(Parametro, {
    foreignKey: "IdEstado",
    targetKey: "IdParametro"
})
 
Parametro.hasMany(Estado, {
    foreignKey: "IdParametro",
    sourceKey: "IdParametro"
})
 
Estado.belongsTo(Parametro, {
    foreignKey: "IdParametro",
    targetKey: "IdParametro"
})
 
Parametro.hasMany(Incidente, {
    foreignKey: "IdParametro",
    sourceKey: "IdParametro"
})
 
Incidente.belongsTo(Parametro, {
    foreignKey: "IdParametro",
    targetKey: "IdParametro"
})
 
Parametro.hasMany(Incidente, {
    foreignKey: "IdTipo",
    sourceKey: "IdParametro",
    as: 'Tipo'
})
 
Incidente.belongsTo(Parametro, {
    foreignKey: "IdTipo",
    targetKey: "IdParametro",
    as: 'Tipo'
})
 
Parametro.hasMany(EstadoDetalle, {
    foreignKey: "IdParametro",
    sourceKey: "IdParametro"
})
 
EstadoDetalle.belongsTo(Parametro, {
    foreignKey: "IdParametro",
    targetKey: "IdParametro"
})
 
Parametro.hasMany(MovimientoMercancia, {
    foreignKey: "IdTipo",
    sourceKey: "IdParametro"
})
 
MovimientoMercancia.belongsTo(Parametro, {
    as: 'Tipo',
    foreignKey: "IdTipo",
    targetKey: "IdParametro"
})
 
Parametro.hasMany(MovimientoMercancia, {
    foreignKey: "IdTipoDoc",
    sourceKey: "IdParametro"
})
 
MovimientoMercancia.belongsTo(Parametro, {
    as: 'TipoDoc',
    foreignKey: "IdTipoDoc",
    targetKey: "IdParametro"
})
 
Parametro.hasMany(EvaluacionArticulo, {
    foreignKey: "IdParametro",
    sourceKey: "IdParametro"
})
 
EvaluacionArticulo.belongsTo(Parametro, {
    foreignKey: "IdParametro",
    targetKey: "IdParametro"
})
 
Parametro.hasMany(EvaluacionArticulo, {
    foreignKey: "IdConclusion",
    sourceKey: "IdParametro",
    as: 'Conclusion'
})
 
EvaluacionArticulo.belongsTo(Parametro, {
    foreignKey: "IdConclusion",
    targetKey: "IdParametro",
    as: 'Conclusion'
})
 
Parametro.hasMany(DetalleDespachoSolicitud, {
    foreignKey: "IdEstadoEntrega",
    sourceKey: "IdParametro",
})
 
DetalleDespachoSolicitud.belongsTo(Parametro, {
    foreignKey: "IdEstadoEntrega",
    targetKey: "IdParametro",
})
 
Parametro.hasMany(DetalleDespachoSolicitud, {
    foreignKey: "IdMotivoDevolucion",
    sourceKey: "IdParametro",
    as: 'Motivo'
})
 
DetalleDespachoSolicitud.belongsTo(Parametro, {
    foreignKey: "IdMotivoDevolucion",
    targetKey: "IdParametro",
    as: 'Motivo'
})
 
Parametro.hasMany(ControlSerie, {
    foreignKey: "IdEstado",
    sourceKey: "IdParametro",
})
 
ControlSerie.belongsTo(Parametro, {
    foreignKey: "IdEstado",
    targetKey: "IdParametro",
})
 
Parametro.hasMany(TransladoAlmacen, {
    foreignKey: "IdEstado",
    sourceKey: "IdParametro"
})
 
TransladoAlmacen.belongsTo(Parametro, {
    foreignKey: "IdEstado",
    targetKey: "IdParametro"
})
 
Parametro.hasMany(Articulo, {
    foreignKey: "IdUnidadMedida",
    sourceKey: "IdParametro"
})
 
Articulo.belongsTo(Parametro, {
    foreignKey: "IdUnidadMedida",
    targetKey: "IdParametro"
})
 
Parametro.hasMany(RelevoAlmacen, {
    foreignKey: "IdParametro",
    sourceKey: "IdParametro"
})
 
RelevoAlmacen.belongsTo(Parametro, {
    foreignKey: "IdParametro",
    targetKey: "IdParametro"
})
 
Parametro.hasMany(DetalleMovimientoMercancia, {
    as: 'unidad_medida',
    foreignKey: "IdUnidadMedida",
    sourceKey: "IdParametro"
})
 
DetalleMovimientoMercancia.belongsTo(Parametro, {
    as: 'unidad_medida',
    foreignKey: "IdUnidadMedida",
    targetKey: "IdParametro"
})