import { GuiaRemision } from '../models/GuiaRemision.js'
import { DetalleGuiaRemision } from '../models/DetalleGuiaRemision.js'
import { EmpresaParametro } from '../models/EmpresaParametro.js'
import { Op } from "sequelize"

//const usuario_activo = "45631343"
//const id_empresa_activo = "38d7f59f-5790-4853-afdc-f8bbc0c2eca0"

import fetch from 'node-fetch'
import { zfill } from '../utils/Format.js'
import { DespachoSolicitud } from '../models/DespachoSolicitud.js'
import { TransladoAlmacen } from '../models/TransladoAlmacen.js'

export const create = async (req, res) => {
    const { user, company } = req.headers
    const usuario_activo = user.username
    const id_empresa_activo = company.id

    try {
        let resultado = {
            status: 'Ok',
            message: 'Se insertó la solicitud correctamente'
        }

        const findEmpresa = await EmpresaParametro.findOne({
            where: {
                IdEmpresa: id_empresa_activo
            }
        })

        const {
            razon_social_remitente,
            tipo_documento_remitente,
            documento_remitente,
            ubigeo_remitente,
            direccion_remitente,
            urbanizacion_remitente,
            departamento_remitente,
            provincia_remitente,
            distrito_remitente,

            razon_social_destinatario,
            tipo_documento_destinatario,
            documento_destinatario,
            ubigeo_destinatario,
            direccion_destinatario,
            urbanizacion_destinatario,
            departamento_destinatario,
            provincia_destinatario,
            distrito_destinatario,
            correo_emision,

            razon_social_proveedor,
            tipo_documento_proveedor,
            documento_proveedor,

            //conductor
            nombre_conductor,
            apellido_conductor,
            dni_conductor,
            licencia_conductor,

            ubigeo_proveedor,
            direccion_proveedor,
            departamento_proveedor,
            provincia_proveedor,
            distrito_proveedor,

            placa,

            codigo_motivo,
            motivo,
            //// IndiTrans
            peso_total,
            unidad_medicion_transportista,
            codigo_modalidad,
            fecha_transporte,

            razon_social_transportista,
            tipo_documento_transportista,
            documento_transportista,

            ubigeo_partida,
            direccion_partida,
            //// urbanizacion partida
            departamento_partida,
            provincia_partida,
            distrito_partida,

            ubigeo_destino,
            direccion_destino,
            //// urbanizacion partida
            departamento_destino,
            provincia_destino,
            distrito_destino,

            comentario,
            lista,

            ///IdDespacho
            IdDespacho,
            IdTransferencia,
        } = req.body

        const rows = lista.map((element, index) => {
            element.Fila = 12
            element.CorrelativoDoc = null
            element.TipoDoc = null
            element.NumPlacaVehiculo = placa
            element.NumContenedor = null
            element.Items = index + 1
            element.UnidadMedida = element.codigo_medida
            element.DesUnidadMedida = element.unidad_medida
            element.CantidadItems = element.cantidad
            element.DetalleItems = element.articulo
            element.SKUProd = element.codigo_articulo
            element.UsuarioCreacion = usuario_activo
            element.UsuarioModifica = usuario_activo
            return element
        })

        const rows_api = rows.map(element => {
            return {
                "NU_ITEM": String(element.Items),
                "CO_UNID_MEDI": element.UnidadMedida,
                "DE_UNID_MEDI": element.DesUnidadMedida,
                "NU_CANT_ITE1": String(element.CantidadItems),
                "DE_ITEM": element.DetalleItems,
                "CO_PROD": String(element.SKUProd).replace(/-/gi, ""),
            }
        })

        rows.push({
            Fila: 3,
            CorrelativoDoc: '0',
            TipoDoc: '06',
            NumPlacaVehiculo: null,
            NumContenedor: null,
            Items: null,
            UnidadMedida: null,
            DesUnidadMedida: null,
            CantidadItems: null,
            DetalleItems: null,
            SKUProd: null,
            UsuarioCreacion: usuario_activo,
            UsuarioModifica: usuario_activo,
        })

        const serie = findEmpresa.SerieGuia
        let corr = findEmpresa.CorrelativoGuia
        let last_corr = await GuiaRemision.max('Correlativo')
        if (last_corr) { corr = last_corr + 1 }

        const data_send = {
            Serie: serie,
            Correlativo: corr,
            TipoDoc: '09',
            CantidadItems: lista.length,
            CantidadGuias: 0,
            CantidadDocumentos: 1,
            RazonSocialRemi: razon_social_remitente,
            TipoDocRemi: tipo_documento_remitente,
            RucRemi: documento_remitente,
            UbigeoRemi: ubigeo_remitente,
            DireccionRemi: direccion_remitente,
            UrbaRemi: urbanizacion_remitente,
            DepaRemi: departamento_remitente,
            ProviRemi: provincia_remitente,
            DistRemi: distrito_remitente,
            PaisRemi: 'PE',
            RazonSocialDest: razon_social_destinatario,
            TipoDocDest: tipo_documento_destinatario,
            DocumentoDest: documento_destinatario,
            UbigeoDest: ubigeo_destinatario,
            DireccionDest: direccion_destinatario,
            UrbaDest: urbanizacion_destinatario,
            DepaDest: departamento_destinatario,
            ProviDest: provincia_destinatario,
            DistDest: distrito_destinatario,
            PaisDest: 'PE',
            CorreoEmision: correo_emision,
            RazonSocialProv: razon_social_proveedor,
            TipoDocProv: tipo_documento_proveedor,
            DocumentoProv: documento_proveedor,
            UbigeoProv: ubigeo_proveedor,
            DireccionProv: direccion_proveedor,
            UrbaProv: '',
            DepaProv: departamento_proveedor,
            ProviProv: provincia_proveedor,
            DistProv: distrito_proveedor,
            PaisProv: 'PE',
            CodMotivoTrans: codigo_motivo,
            MotivoTrans: motivo,
            IndiTrans: '1',
            PesoTotal: peso_total,
            UnidadMedida: unidad_medicion_transportista,
            CodModaTranslado: codigo_modalidad,
            FechaTransporte: fecha_transporte,
            RazonSocialTrans: razon_social_transportista,
            TipoDocTrans: tipo_documento_transportista,
            DocumentoTrans: documento_transportista,
            UbigeoPartida: ubigeo_partida,
            DireccionPartida: direccion_partida,
            UrbaPartida: '',
            DepaPartida: departamento_partida,
            ProvPartida: provincia_partida,
            DistPartida: distrito_partida,
            UbigeoDestino: ubigeo_destino,
            DireccionDestino: direccion_destino,
            UrbaDestino: '',
            DepaDestino: departamento_destino,
            ProvDestino: provincia_destino,
            DistDestino: distrito_destino,
            NumeroBultos: lista.length,
            Observaciones: comentario,
            Pedido: '',
            UsuarioCreacion: usuario_activo,
            UsuarioModifica: usuario_activo,
            DetalleGuiaRemisions: rows,
            IdEmpresa: findEmpresa.IdEmpresa,
            Emails: correo_emision,
            TipoDocCond: '1',
            DocumentoCond: dni_conductor,
            NombreCond: nombre_conductor,
            ApellidoCond: apellido_conductor,
            LicenciaCond: licencia_conductor,
        }

        const res_access = await fetch(`${process.env.API_EFFACT}/api/Access/AccessAuthenticacion`, {
            method: 'POST',
            body: JSON.stringify({
                Usuario: process.env.USUARIO_EFFACT,
                Clave: process.env.CLAVE_EFFACT,
                CoRuc: findEmpresa.Ruc
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const token_json = await res_access.json()

        const send_data = [
            {
                "FE_EMIS": (new Date()).toISOString().substring(0, 10),
                "NU_SERI": `${data_send.Serie}-${zfill(data_send.Correlativo, 7)}`,
                "TI_DOCU": data_send.TipoDoc,
                "NU_CANT_ITEM": data_send.CantidadItems,
                "NU_CANT_GUIA": data_send.CantidadGuias,
                "NU_CANT_DOCU": data_send.CantidadDocumentos,
                "NU_CANT_COND": 0,
                "NU_CANT_PLAC": placa === '' ? 0 : 1,
                "NU_CANT_CONT": 0,
                "NU_GUIA": "",
                "CO_TIPO_DOCU_COMP": "",
                "NU_DOCU_COND": data_send.DocumentoCond,
                "CO_TIPO_DOCU_COND": data_send.TipoDocCond,
                "NO_COND": data_send.NombreCond,
                "NO_APEL_COND": data_send.ApellidoCond,
                "NO_RAZO_SOCI_REMI": data_send.RazonSocialRemi,
                "CO_TIPO_DOCU_REMI": data_send.TipoDocRemi,
                "NU_DOCU_REMI": data_send.RucRemi,
                "CO_UBIG_REMI": data_send.UbigeoRemi,
                "NO_DIRE_REMI": data_send.DireccionRemi,
                "NO_URBA_REMI": data_send.UrbaRemi,
                "NO_DEPA_REMI": data_send.DepaRemi,
                "NO_PROV_REMI": data_send.ProviRemi,
                "NO_DIST_REMI": data_send.DistRemi,
                "CO_PAIS_REMI": "PE",
                "NO_RAZO_SOCI_DEST": data_send.RazonSocialDest,
                "CO_TIPO_DOCU_DEST": data_send.TipoDocDest,
                "NU_DOCU_DEST": data_send.DocumentoDest,
                "CO_UBIG_DEST": data_send.UbigeoDest,
                "NO_DIRE_DEST": data_send.DireccionDest,
                "NO_URBA_DEST": data_send.UrbaDest,
                "NO_DEPA_DEST": data_send.DepaDest,
                "NO_PROV_DEST": data_send.ProviDest,
                "NO_DIST_DEST": data_send.DistDest,
                "CO_PAIS_DEST": "PE",
                "NO_CORR_DEST": data_send.CorreoEmision,
                "NO_RAZO_SOCI_PROV": data_send.RazonSocialProv,
                "CO_TIPO_DOCU_PROV": data_send.TipoDocProv,
                "NU_DOCU_PROV": data_send.DocumentoProv,
                "CO_UBIG_PROV": data_send.UbigeoProv,
                "NO_DIRE_PROV": data_send.DireccionProv,
                "NO_URBA_PROV": data_send.UrbaProv,
                "NO_DEPA_PROV": data_send.DepaProv,
                "NO_PROV_PROV": data_send.ProviProv,
                "NO_DIST_PROV": data_send.DistProv,
                "CO_PAIS_PROV": "PE",
                "CO_MOTI_TRAS": data_send.CodMotivoTrans,
                "NO_DESC_MOTI": data_send.MotivoTrans,
                "ST_INDI_TRAN": "1",
                "NU_PESO_TOTA": data_send.PesoTotal,
                "NO_UNID_PESO": data_send.UnidadMedida,
                "CO_MODA_TRAS": data_send.CodModaTranslado,
                "FE_INIC_TRAS": (new Date(data_send.FechaTransporte)).toISOString().substring(0, 10),
                "NO_RAZO_SOCI_TRAN": data_send.RazonSocialTrans,
                "TI_DOCU_TRAN": data_send.TipoDocTrans,
                "NU_RUCC_TRAN": data_send.DocumentoTrans,
                "CO_UBIG_PUNT_PART": data_send.UbigeoPartida,
                "NO_DIRE_PUNT_PART": data_send.DireccionPartida,
                "NO_URBA_PUNT_PART": data_send.UrbaPartida,
                "NO_DEPA_PUNT_PART": data_send.DepaPartida,
                "NO_PROV_PUNT_PART": data_send.ProvPartida,
                "NO_DIST_PUNT_PART": data_send.DistPartida,
                "CO_UBIG_PUNT_LLEG": data_send.UbigeoDestino,
                "NO_DIRE_PUNT_LLEG": data_send.DireccionDestino,
                "NO_URBA_PUNT_LLEG": data_send.UrbaDestino,
                "NO_DEPA_PUNT_LLEG": data_send.DepaDestino,
                "NO_PROV_PUNT_LLEG": data_send.ProvDestino,
                "NO_DIST_PUNT_LLEG": data_send.DistDestino,
                "NU_BULTO": "0",
                "CO_PUER_AERO": "                              ",
                "NO_OBSV": data_send.Observaciones,
                "CO_PEDIDO": "",
                "DE_REFE": "",
                "ITEMS": rows_api,
                "DOC_RELACIONADOS": [
                    {
                        "NU_DOCU": "0",
                        "CO_TIPO_DOCU": "06"
                    }
                ],
                "DATOS_VEHICULO": [
                    {
                        "NU_PLAC_VEHI": placa,
                    }
                ],
                "DATO_CONTENEDORES": [
                    {
                        "NU_CONT_RELA": ""
                    }
                ]
            }
        ]

        const res_register = await fetch(`${process.env.API_EFFACT}/api/Worker/RegisterDocuments`, {
            method: 'POST',
            body: JSON.stringify(send_data),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token_json}`
            }
        })

        //console.log(JSON.stringify(send_data))
        console.log(JSON.stringify(token_json))
        console.log(JSON.stringify(send_data))
        const resp_json = await res_register.json()
        resultado.message = resp_json

        if (Array.isArray(resp_json)) {
            if (resp_json.length > 0) {
                const r = resp_json[0]
                console.log('--------2--------')
                console.log(r)
                const sr = String(r.DE_ERRO).split(' || ')[0]
                console.log('--------3--------')
                console.log(sr)
                if (sr === "1") {
                    let newGuia = await GuiaRemision.create(data_send, {
                        include: [DetalleGuiaRemision]
                    })
                    if (IdDespacho) {
                        const find_despacho = await DespachoSolicitud.findOne({
                            where: {
                                IdDespacho: IdDespacho
                            }
                        })
                        if (find_despacho) {
                            find_despacho.IdGuia = newGuia.IdGuia
                            await find_despacho.save()
                        }
                    }
                    if (IdTransferencia) {
                        const find_translado = await TransladoAlmacen.findOne({
                            where: {
                                IdTransferencia: IdTransferencia
                            }
                        })
                        if (find_translado) {
                            find_translado.IdGuia = newGuia.IdGuia
                            await find_translado.save()
                        }
                    }
                }
            }
        }
        console.log('--------1--------')
        console.log(resp_json)
        return res.json(resultado)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message,
        })
    }
}

export const list = async (req, res) => {
    const { company } = req.headers
    const id_empresa_activo = company.id

    try {
        const {
            fecha_inicio,
            fecha_fin,
            comprobante,
            destinatario,
        } = req.body

        let where = {
            IdEmpresa: id_empresa_activo,
        }

        if (fecha_inicio) {
            where.FechaCreacion = {
                [Op.gte]: fecha_inicio
            }
        }

        if (fecha_fin) {
            where.FechaCreacion = {
                [Op.lte]: fecha_fin
            }
        }

        if (comprobante) {
            const split_data = String(comprobante).split('-')
            if (split_data.length > 0) {
                where.Serie = split_data[0]
            }
            if (split_data.length > 1) {
                const corr = parseInt(split_data[1])
                if (!isNaN(corr)) {
                    where.Correlativo = corr
                }
            }
        }

        if (destinatario) {
            let op_destinatario = String(destinatario).replace(/ /g, "%")
            op_destinatario = `%${op_destinatario}%`
            where[Op.or] = [
                {
                    RazonSocialDest: {
                        [Op.like]: op_destinatario
                    }
                }, {
                    DocumentoDest: {
                        [Op.like]: op_destinatario
                    }
                }
            ]
        }

        const guides = await GuiaRemision.findAll({
            attributes: [
                ["IdGuia", "id"],
                "FechaEmision",
                "Serie",
                "Correlativo",
                "RazonSocialDest",
                "DocumentoDest",
            ],
            where: where,
            order: [
                ["FechaCreacion", "DESC"]
            ]
        })
        res.json(guides)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

export const getOne = async (req, res) => {
    const {
        IdGuia,
    } = req.body

    try {
        const guide = await GuiaRemision.findOne({
            include: {
                model: DetalleGuiaRemision
            },
            where: {
                IdGuia: IdGuia
            }
        })
        res.json(guide)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}