import { DataTypes } from "sequelize"
import Sequelize from "sequelize"
import { sequelize } from "../database/database.js"
import { Usuario } from './Usuario.js'
import { SolicitudArticulo } from './SolicitudArticulo.js'
import { TipoNegocio } from './TipoNegocio.js'
import { DespachoSolicitud } from "./DespachoSolicitud.js"
import { Incidente } from "./Incidente.js"
import { TransladoAlmacen } from "./TransladoAlmacen.js"
import { Almacen } from "./Almacen.js"
import { GuiaRemision } from "./GuiaRemision.js"
import { TransacAlmacen } from "./TransacAlmacen.js";
import { MovimientoMercancia } from "./MovimientoMercancia.js";
import { UsuarioEmpresa } from "./UsuarioEmpresa.js";
import { RelevoAlmacen } from "./RelevoAlmacen.js"
import { DetalleRelevoAlmacen } from "./DetalleRelevoAlmacen.js"
import { GrupoArticulo } from "./GrupoArticulo.js";
import { GrupoArticuloMaestro } from "./GrupoArticuloMaestro.js";
import { ControlSerie } from "./ControlSerie.js";

export const EmpresaParametro = sequelize.define(
    "EmpresaParametros",
    {
        IdEmpresa: {
            type: DataTypes.STRING,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        Ruc: {
            type: DataTypes.STRING,
        },
        RazonSocial: {
            type: DataTypes.STRING,
        },
        NombreComercial: {
            type: DataTypes.STRING,
        },
        Direccion: {
            type: DataTypes.STRING,
        },
        UsuarioCreacion: {
            type: DataTypes.STRING,
        },
        BaseSAP: {
            type: DataTypes.STRING,
        },
        CodigoApiSap: {
            type: DataTypes.STRING,
        },
        UsuarioApiSap: {
            type: DataTypes.STRING,
        },
        ContrasenaApiSap: {
            type: DataTypes.STRING,
        },
        IsGrupoTawa: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        SerieGuia: {
            type: DataTypes.STRING(50),
            defaultValue: 'T001',
        },
        CorrelativoGuia: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
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
        Activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        }
    },
    {
        timestamps: false,
    }
)

EmpresaParametro.hasMany(Usuario, {
    foreignKey: "IdEmpresa",
    sourceKey: "IdEmpresa"
})

Usuario.belongsTo(EmpresaParametro, {
    foreignKey: "IdEmpresa",
    targetKey: "IdEmpresa"
})

EmpresaParametro.hasMany(SolicitudArticulo, {
    foreignKey: "IdEmpresa",
    sourceKey: "IdEmpresa"
})

SolicitudArticulo.belongsTo(EmpresaParametro, {
    foreignKey: "IdEmpresa",
    targetKey: "IdEmpresa"
})

EmpresaParametro.hasMany(TipoNegocio, {
    foreignKey: "IdEmpresa",
    sourceKey: "IdEmpresa"
})

TipoNegocio.belongsTo(EmpresaParametro, {
    foreignKey: "IdEmpresa",
    targetKey: "IdEmpresa"
})

EmpresaParametro.hasMany(DespachoSolicitud, {
    foreignKey: "IdEmpresa",
    sourceKey: "IdEmpresa"
})

DespachoSolicitud.belongsTo(EmpresaParametro, {
    foreignKey: "IdEmpresa",
    targetKey: "IdEmpresa"
})

EmpresaParametro.hasMany(TransacAlmacen, {
    foreignKey: "IdEmpresa",
    sourceKey: "IdEmpresa"
})

TransacAlmacen.belongsTo(EmpresaParametro, {
    foreignKey: "IdEmpresa",
    targetKey: "IdEmpresa"
})

EmpresaParametro.hasMany(MovimientoMercancia, {
    foreignKey: "IdEmpresa",
    sourceKey: "IdEmpresa"
})

MovimientoMercancia.belongsTo(EmpresaParametro, {
    foreignKey: "IdEmpresa",
    targetKey: "IdEmpresa"
})

EmpresaParametro.hasMany(UsuarioEmpresa, {
    foreignKey: "IdEmpresa",
    sourceKey: "IdEmpresa"
})

UsuarioEmpresa.belongsTo(EmpresaParametro, {
    foreignKey: "IdEmpresa",
    targetKey: "IdEmpresa"
})

EmpresaParametro.hasMany(Incidente, {
    foreignKey: "IdEmpresa",
    sourceKey: "IdEmpresa"
})

Incidente.belongsTo(EmpresaParametro, {
    foreignKey: "IdEmpresa",
    targetKey: "IdEmpresa"
})

EmpresaParametro.hasMany(TransladoAlmacen, {
    foreignKey: "IdEmpresa",
    sourceKey: "IdEmpresa"
})

TransladoAlmacen.belongsTo(EmpresaParametro, {
    foreignKey: "IdEmpresa",
    targetKey: "IdEmpresa"
})

EmpresaParametro.hasMany(Almacen, {
    foreignKey: "IdEmpresa",
    sourceKey: "IdEmpresa"
})

Almacen.belongsTo(EmpresaParametro, {
    foreignKey: "IdEmpresa",
    targetKey: "IdEmpresa"
})

EmpresaParametro.hasMany(GuiaRemision, {
    foreignKey: "IdEmpresa",
    sourceKey: "IdEmpresa"
})

GuiaRemision.belongsTo(EmpresaParametro, {
    foreignKey: "IdEmpresa",
    targetKey: "IdEmpresa"
})

EmpresaParametro.hasMany(RelevoAlmacen, {
    foreignKey: "IdEmpresa",
    sourceKey: "IdEmpresa"
})

RelevoAlmacen.belongsTo(EmpresaParametro, {
    foreignKey: "IdEmpresa",
    targetKey: "IdEmpresa"
})

EmpresaParametro.hasMany(DetalleRelevoAlmacen, {
    foreignKey: "IdEmpresa",
    sourceKey: "IdEmpresa"
})

DetalleRelevoAlmacen.belongsTo(EmpresaParametro, {
    foreignKey: "IdEmpresa",
    targetKey: "IdEmpresa"
})

EmpresaParametro.hasMany(GrupoArticulo, {
    foreignKey: "IdEmpresa",
    sourceKey: "IdEmpresa"
})

GrupoArticulo.belongsTo(EmpresaParametro, {
    foreignKey: "IdEmpresa",
    targetKey: "IdEmpresa"
})

EmpresaParametro.hasMany(ControlSerie, {
    foreignKey: "IdEmpresa",
    sourceKey: "IdEmpresa"
})

ControlSerie.belongsTo(EmpresaParametro, {
    foreignKey: "IdEmpresa",
    targetKey: "IdEmpresa"
})

EmpresaParametro.hasMany(GrupoArticuloMaestro, {
    foreignKey: "IdEmpresa",
    sourceKey: "IdEmpresa"
})

GrupoArticuloMaestro.belongsTo(EmpresaParametro, {
    foreignKey: "IdEmpresa",
    targetKey: "IdEmpresa"
})