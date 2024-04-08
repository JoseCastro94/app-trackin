import { col, DataTypes } from "sequelize"
import Sequelize from "sequelize"
import { sequelize } from "../database/database.js"
import { TransacAlmacen } from "./TransacAlmacen.js"
import { EvaluacionArticulo } from "./EvaluacionArticulo.js"

const columns = {
    IdDetalleDespacho: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    },
    IdDespacho: {
        type: DataTypes.STRING(36),
    },
    ItemCode: {
        type: DataTypes.STRING,
    },
    ItemName: {
        type: DataTypes.STRING(200),
    },
    U_BPP_TIPUNMED: {
        type: DataTypes.STRING(10),
    },
    Cantidad: {
        type: DataTypes.INTEGER(10),
    },
    CantidadPicking: {
        type: DataTypes.INTEGER(10),
    },
    CantidadEntrega: {
        type: DataTypes.INTEGER(10),
    },
    CantidadPendienteEvaluar: {
        type: DataTypes.INTEGER(10),
        defaultValue: 0
    },
    CantidadEvaluado: {
        type: DataTypes.INTEGER(10),
        defaultValue: 0
    },
    EstadoEvaluado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    ComentarioMotivoDevolucion: {
        type: DataTypes.TEXT(),
    },
    PendienteDevolver: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    SerialNumber: {
        type: DataTypes.STRING(50),
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
    }
}

export const DetalleDespachoSolicitud = sequelize.define(
    "DetalleDespachoSolicitud",
    columns,
    {
        timestamps: false,
    }
)

DetalleDespachoSolicitud.hasMany(TransacAlmacen, {
    foreignKey: "IdDetalleDespacho",
    sourceKey: "IdDetalleDespacho"
})

TransacAlmacen.belongsTo(DetalleDespachoSolicitud, {
    foreignKey: "IdDetalleDespacho",
    targetKey: "IdDetalleDespacho"
})

DetalleDespachoSolicitud.hasMany(EvaluacionArticulo, {
    foreignKey: "IdDetalleDespacho",
    sourceKey: "IdDetalleDespacho"
})

EvaluacionArticulo.belongsTo(DetalleDespachoSolicitud, {
    foreignKey: "IdDetalleDespacho",
    targetKey: "IdDetalleDespacho"
})