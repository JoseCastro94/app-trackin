import Sequelize, { Op } from "sequelize"
import { Almacen } from "../models/Almacen.js"
import { DespachoSolicitud } from '../models/DespachoSolicitud.js'
import { DetalleDespachoSolicitud } from "../models/DetalleDespachoSolicitud.js"
import { DetalleSolicitudArticulo } from "../models/DetalleSolicitudArticulo.js"
import { ArticuloNegocio } from "../models/ArticuloNegocio.js"
import { Articulo } from "../models/Articulo.js"
import { Usuario } from "../models/Usuario.js"
import { Parametro } from "../models/Parametro.js"
import { Ubigeo } from "../models/Ubigeo.js"

export const findOne = async (req, res) => {
    const {
        IdDespacho
    } = req.body

    try {
        const find_despacho = await DespachoSolicitud.findOne({
            attributes: [
                "IdDespacho",
                "Codigo"
            ],
            where: {
                IdDespacho: IdDespacho
            },
            include: [
                {
                    model: Usuario,
                    attributes: [
                        "NroDocumento",
                        "TipoDocumento",
                    ]
                }, {
                    model: Almacen,
                    attributes: [
                        "IdAlmacen"
                    ],
                    include: {
                        model: Ubigeo
                    }
                }, {
                    model: DetalleDespachoSolicitud,
                    attributes: [
                        "IdDetalleDespacho",
                        "CantidadEntrega",
                        "ItemName",
                        "ItemCode",
                    ],
                    include: {
                        model: DetalleSolicitudArticulo,
                        attributes: [
                            "IdDetalleSocilitud"
                        ],
                        include: {
                            model: ArticuloNegocio,
                            attributes: [
                                "IdArticuloNegocio"
                            ],
                            include: {
                                model: Articulo,
                                attributes: [
                                    "IdArticulo"
                                ],
                                include: {
                                    model: Parametro,
                                    attributes: [
                                        "IdParametro",
                                        "Nombre",
                                        "Descripcion",
                                    ]
                                }
                            }
                        }
                    }
                }
            ]
        })
        return res.status(200).json(find_despacho)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: error.message,
        })
    }
}