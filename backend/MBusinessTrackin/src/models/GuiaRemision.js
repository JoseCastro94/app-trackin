import { DataTypes } from "sequelize"
import Sequelize from "sequelize"
import { sequelize } from "../database/database.js"
import { DetalleGuiaRemision } from './DetalleGuiaRemision.js'
import { DespachoSolicitud } from "./DespachoSolicitud.js"
import { TransladoAlmacen } from "./TransladoAlmacen.js"

export const GuiaRemision = sequelize.define(
    "GuiaRemision",
    {
        IdGuia: {
            type: DataTypes.STRING(50),
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        FechaEmision: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW,
        },
        Serie: {
            type: DataTypes.STRING(40),
        },
        Correlativo: {
            type: DataTypes.INTEGER(10),
        },
        TipoDoc: {
            type: DataTypes.STRING(40),
        },
        CantidadItems: {
            type: DataTypes.INTEGER(10),
        },
        CantidadGuias: {
            type: DataTypes.INTEGER(10),
        },
        CantidadDocumentos: {
            type: DataTypes.INTEGER(10),
        },
        RazonSocialRemi: {
            type: DataTypes.STRING(200),
        },
        TipoDocRemi: {
            type: DataTypes.STRING(20),
        },
        RucRemi: {
            type: DataTypes.STRING(40),
        },
        UbigeoRemi: {
            type: DataTypes.STRING(40),
        },
        DireccionRemi: {
            type: DataTypes.STRING(200),
        },
        UrbaRemi: {
            type: DataTypes.STRING(40),
        },
        DepaRemi: {
            type: DataTypes.STRING(40),
        },
        ProviRemi: {
            type: DataTypes.STRING(40),
        },
        DistRemi: {
            type: DataTypes.STRING(40),
        },
        PaisRemi: {
            type: DataTypes.STRING(40),
        },
        RazonSocialDest: {
            type: DataTypes.STRING(200),
        },
        TipoDocDest: {
            type: DataTypes.STRING(40),
        },
        DocumentoDest: {
            type: DataTypes.STRING(40),
        },
        UbigeoDest: {
            type: DataTypes.STRING(40),
        },
        DireccionDest: {
            type: DataTypes.STRING(200),
        },
        UrbaDest: {
            type: DataTypes.STRING(40),
        },
        DepaDest: {
            type: DataTypes.STRING(40),
        },
        ProviDest: {
            type: DataTypes.STRING(40),
        },
        DistDest: {
            type: DataTypes.STRING(40),
        },
        PaisDest: {
            type: DataTypes.STRING(40),
        },
        CorreoEmision: {
            type: DataTypes.STRING(200),
        },
        RazonSocialProv: {
            type: DataTypes.STRING(200),
        },
        TipoDocProv: {
            type: DataTypes.STRING(40),
        },
        DocumentoProv: {
            type: DataTypes.STRING(40),
        },
        UbigeoProv: {
            type: DataTypes.STRING(40),
        },
        DireccionProv: {
            type: DataTypes.STRING(200),
        },
        UrbaProv: {
            type: DataTypes.STRING(40),
        },
        DepaProv: {
            type: DataTypes.STRING(40),
        },
        ProviProv: {
            type: DataTypes.STRING(40),
        },
        DistProv: {
            type: DataTypes.STRING(40),
        },
        PaisProv: {
            type: DataTypes.STRING(40),
        },
        CodMotivoTrans: {
            type: DataTypes.STRING(10),
        },
        MotivoTrans: {
            type: DataTypes.STRING(100),
        },
        IndiTrans: {
            type: DataTypes.STRING(10),
        },
        PesoTotal: {
            type: DataTypes.DECIMAL(10, 1),
        },
        UnidadMedida: {
            type: DataTypes.STRING(40),
        },
        CodModaTranslado: {
            type: DataTypes.STRING(40),
        },
        Emails: {
            type: DataTypes.STRING(250),
        },
        FechaTransporte: {
            type: DataTypes.DATE,
        },
        RazonSocialTrans: {
            type: DataTypes.STRING(200),
        },
        TipoDocTrans: {
            type: DataTypes.STRING(40),
        },
        DocumentoTrans: {
            type: DataTypes.STRING(40),
        },
        UbigeoPartida: {
            type: DataTypes.STRING(40),
        },
        DireccionPartida: {
            type: DataTypes.STRING(300),
        },
        UrbaPartida: {
            type: DataTypes.STRING(200),
        },
        DepaPartida: {
            type: DataTypes.STRING(100),
        },
        ProvPartida: {
            type: DataTypes.STRING(100),
        },
        DistPartida: {
            type: DataTypes.STRING(100),
        },
        UbigeoDestino: {
            type: DataTypes.STRING(40),
        },
        DireccionDestino: {
            type: DataTypes.STRING(300),
        },
        UrbaDestino: {
            type: DataTypes.STRING(40),
        },
        DepaDestino: {
            type: DataTypes.STRING(50),
        },
        ProvDestino: {
            type: DataTypes.STRING(40),
        },
        DistDestino: {
            type: DataTypes.STRING(40),
        },
        NumeroBultos: {
            type: DataTypes.INTEGER(10),
        },
        Observaciones: {
            type: DataTypes.STRING(400),
        },
        Pedido: {
            type: DataTypes.STRING(40),
        },
        EstatusEfact: {
            type: DataTypes.STRING(200),
            defaultValue: "1"
        },
        TipoDocCond: {
            type: DataTypes.STRING(40),
        },
        DocumentoCond: {
            type: DataTypes.STRING(40),
        },
        NombreCond: {
            type: DataTypes.STRING(150),
        },
        ApellidoCond: {
            type: DataTypes.STRING(200),
        },
        LicenciaCond: {
            type: DataTypes.STRING(30),
        },
        UsuarioCreacion: {
            type: DataTypes.STRING(40),
        },
        FechaCreacion: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW,
        },
        UsuarioModifica: {
            type: DataTypes.STRING(40),
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

GuiaRemision.hasMany(DetalleGuiaRemision, {
    foreignKey: "IdGuia",
    sourceKey: "IdGuia"
})

DetalleGuiaRemision.belongsTo(GuiaRemision, {
    foreignKey: "IdGuia",
    targetKey: "IdGuia"
})

GuiaRemision.hasMany(DespachoSolicitud, {
    foreignKey: "IdGuia",
    sourceKey: "IdGuia"
})

DespachoSolicitud.belongsTo(GuiaRemision, {
    foreignKey: "IdGuia",
    targetKey: "IdGuia"
})

GuiaRemision.hasMany(TransladoAlmacen, {
    foreignKey: "IdGuia",
    sourceKey: "IdGuia"
})

TransladoAlmacen.belongsTo(GuiaRemision, {
    foreignKey: "IdGuia",
    targetKey: "IdGuia"
})