import { DataTypes } from "sequelize"
import Sequelize from "sequelize"
import { sequelize } from "../database/database.js"
import { hashPassword } from '../helper/Security.js'
import { UsuarioAlmacen } from './UsuarioAlmacen.js'
import { SolicitudArticulo } from './SolicitudArticulo.js'
import { DetalleSolicitudArticulo } from './DetalleSolicitudArticulo.js'
import { UsuarioNegocio } from './UsuarioNegocio.js'
import { DespachoSolicitud } from "./DespachoSolicitud.js"
import { GrupoTrabajador } from "./GrupoTrabajador.js"
import { TransacAlmacen } from "./TransacAlmacen.js"
import { TransladoAlmacen } from "./TransladoAlmacen.js"
import { UsuarioEmpresa } from "./UsuarioEmpresa.js";
import { RelevoAlmacen } from './RelevoAlmacen.js'

export const Usuario = sequelize.define(
    "Usuarios",
    {
        IdUsuario: {
            type: DataTypes.STRING,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        ApellidoPaterno: {
            type: DataTypes.STRING,
        },
        ApellidoMaterno: {
            type: DataTypes.STRING,
        },
        Nombres: {
            type: DataTypes.STRING,
        },
        Activo: {
            type: DataTypes.BOOLEAN,
        },
        Clave: {
            type: DataTypes.STRING,
        },
        Correo: {
            type: DataTypes.STRING,
        },
        TipoDocumento: {
            type: DataTypes.STRING,
        },
        NroDocumento: {
            type: DataTypes.STRING,
        },
        EsResponsable: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
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

Usuario.hasMany(UsuarioAlmacen, {
    foreignKey: "IdUsuario",
    sourceKey: "IdUsuario"
})

UsuarioAlmacen.belongsTo(Usuario, {
    foreignKey: "IdUsuario",
    targetKey: "IdUsuario"
})

Usuario.hasMany(SolicitudArticulo, {
    foreignKey: "IdUsuarioSolicita",
    sourceKey: "IdUsuario"
})

SolicitudArticulo.belongsTo(Usuario, {
    foreignKey: "IdUsuarioSolicita",
    targetKey: "IdUsuario",
})

Usuario.hasMany(DetalleSolicitudArticulo, {
    foreignKey: "IdUsuario",
    sourceKey: "IdUsuario",
    as: 'Asignado'
})

DetalleSolicitudArticulo.belongsTo(Usuario, {
    foreignKey: "IdUsuario",
    targetKey: "IdUsuario",
    as: 'Asignado',
})

Usuario.hasMany(UsuarioNegocio, {
    foreignKey: "IdUsuario",
    sourceKey: "IdUsuario"
})

UsuarioNegocio.belongsTo(Usuario, {
    foreignKey: "IdUsuario",
    targetKey: "IdUsuario"
})

Usuario.hasMany(DespachoSolicitud, {
    foreignKey: "IdAsignado",
    sourceKey: "IdUsuario",
})

DespachoSolicitud.belongsTo(Usuario, {
    foreignKey: "IdAsignado",
    targetKey: "IdUsuario"
})

Usuario.hasMany(GrupoTrabajador, {
    foreignKey: "IdUsuarioNivel",
    sourceKey: "IdUsuario"
})

GrupoTrabajador.belongsTo(Usuario, {
    foreignKey: "IdUsuarioNivel",
    targetKey: "IdUsuario"
})

Usuario.hasMany(GrupoTrabajador, {
    foreignKey: "IdUsuarioSubNivel",
    sourceKey: "IdUsuario"
})

GrupoTrabajador.belongsTo(Usuario, {
    foreignKey: "IdUsuarioSubNivel",
    sourceKey: "IdUsuario"
})

Usuario.hasMany(TransacAlmacen, {
    foreignKey: "IdUsuario",
    sourceKey: "IdUsuario"
})

TransacAlmacen.belongsTo(Usuario, {
    foreignKey: "IdUsuario",
    targetKey: "IdUsuario"
})

Usuario.hasMany(DespachoSolicitud, {
    foreignKey: "IdAsignado",
    sourceKey: "IdUsuario"
})

DespachoSolicitud.belongsTo(Usuario, {
    foreignKey: "IdAsignado",
    targetKey: "IdUsuario"
})

Usuario.hasMany(DespachoSolicitud, {
    as: 'responsableAlmacen',
    foreignKey: "IdResponsableAlmacen",
    sourceKey: "IdUsuario"
})

DespachoSolicitud.belongsTo(Usuario, {
    as: 'responsableAlmacen',
    foreignKey: "IdResponsableAlmacen",
    targetKey: "IdUsuario"
})

Usuario.hasMany(TransladoAlmacen, {
    foreignKey: "IdUsuario",
    sourceKey: "IdUsuario"
})

TransladoAlmacen.belongsTo(Usuario, {
    foreignKey: "IdUsuario",
    targetKey: "IdUsuario"
})

Usuario.hasMany(UsuarioEmpresa, {
    foreignKey: "IdUsuario",
    sourceKey: "IdUsuario"
})

UsuarioEmpresa.belongsTo(Usuario, {
    foreignKey: "IdUsuario",
    targetKey: "IdUsuario"
})

Usuario.hasMany(RelevoAlmacen, {
    foreignKey: "IdUsuarioOrigen",
    sourceKey: "IdUsuario",
    as: 'UsuarioOrigen'
})

RelevoAlmacen.belongsTo(Usuario, {
    foreignKey: "IdUsuarioOrigen",
    targetKey: "IdUsuario",
    as: 'UsuarioOrigen'
})

Usuario.hasMany(RelevoAlmacen, {
    foreignKey: "IdUsuarioDestino",
    sourceKey: "IdUsuario",
    as: 'UsuarioDestino'
})

RelevoAlmacen.belongsTo(Usuario, {
    foreignKey: "IdUsuarioDestino",
    targetKey: "IdUsuario",
    as: 'UsuarioDestino'
})
