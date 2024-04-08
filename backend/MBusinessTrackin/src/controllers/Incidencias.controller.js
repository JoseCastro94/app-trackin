import Sequelize, { Op } from "sequelize"
import { Incidente } from '../models/Incidente.js'
import { Almacen } from '../models/Almacen.js'
import { TipoNegocio } from '../models/TipoNegocio.js'
import { Articulo } from '../models/Articulo.js'
import { Parametro } from '../models/Parametro.js'
import { GrupoArticulo } from '../models/GrupoArticulo.js'
import { IncidenteAdjunto } from '../models/IncidenteAdjunto.js'

import { ProcesarStock, TransladoSerie, AddStock } from '../operations/stocks.js'
import { Stock } from "../models/Stock.js"
import IncidenteRepository from "../repositories/IncidenteRepository.js";
import fetch from "node-fetch";

export const getIncidentes = async (req, res) => {
    const { user, company } = req.headers
    const id_empresa_activo = company.id
    const usuario_activo = user.username

    try {
        const incidentes = await Incidente.findAll({
            attributes: [
                ["IdIncidente", "id"],
                "Periodo",
                "Correlativo",
                "Cantidad",
                "Comentario",
                "FechaCreacion",
                [Sequelize.col('Almacene.Nombre'), "Almacen"],
                [Sequelize.col('TipoNegocio.Nombre'), "Negocio"],
                [Sequelize.col('Articulo.ItemCode'), "CodArticulo"],
                [Sequelize.col('Articulo.ItemName'), "NomArticulo"],
                [Sequelize.col('Parametro.Nombre'), "Incidente"],
                [Sequelize.col('Articulo.GrupoArticulo.Nombre'), "Categoria"],
            ],
            include: [
                {
                    model: Almacen,
                    attributes: []
                },
                {
                    model: TipoNegocio,
                    attributes: []
                },
                {
                    model: Articulo,
                    attributes: [],
                    include: {
                        model: GrupoArticulo,
                        attributes: []
                    }
                },
                {
                    model: Parametro,
                    attributes: []
                }
            ],
            where: {
                IdEmpresa: id_empresa_activo,
                UsuarioCreacion: usuario_activo
            }
        })
        res.json(incidentes)
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: e.message });
    }
}

export const insIncidente = async (req, res) => {
    const { user, company } = req.headers
    const usuario_activo = user.username
    const id_usuario_activo = user.id_user
    const id_empresa_activo = company.id

    try {
        const {
            IdAlmacen,
            IdNegocio,
            IdArticulo,
            Cantidad,
            Comentario,
            IdParametro,
            IdTipo,
            Adjuntos,
            U_Devolucion,
            Grupo,
            ItemCode,
            ItemName,
            serie,
            IdDetalleRelevoAlmacen
        } = req.body

        let resultado = {
            status: 'Ok',
            message: 'Se insertó la incidencia correctamente'
        }

        const find_stock = await Stock.findOne({
            where: {
                IdAlmacen: IdAlmacen,
                IdNegocio: IdNegocio,
                IdArticulo: IdArticulo
            }
        })

        if (find_stock) {
            let msg = []
            const num = parseInt(Cantidad)
            if (num <= 0) {
                msg.push('La cantidad no puede ser menor o igual a cero')
            }

            if (find_stock.Cantidad - num < 0) {
                msg.push('El stock es menor a la cantidad ingresada por el incidente')
            }

            if (msg.length > 0) {
                resultado.status = 'error'
                resultado.message = msg.join(', ')
            } else {
                let now = new Date()
                let year = now.getFullYear()

                let last_corr = await Incidente.max('Correlativo', {
                    where: {
                        Periodo: year
                    }
                })

                let corr = 1

                if (last_corr) {
                    corr = last_corr + 1
                }

                let newIncidente = await Incidente.create({
                    Periodo: year,
                    Correlativo: corr,
                    IdAlmacen,
                    IdNegocio,
                    IdArticulo,
                    Cantidad,
                    Comentario,
                    IdParametro,
                    IdTipo,
                    SerialNumber: serie.SerialNumber,
                    UsuarioCreacion: usuario_activo,
                    UsuarioModifica: usuario_activo,
                    IdEmpresa: id_empresa_activo,
                    IdDetalleRelevoAlmacen: IdDetalleRelevoAlmacen
                })

                await IncidenteAdjunto.update({
                    IdIncidente: newIncidente.IdIncidente
                }, {
                    where: {
                        IdAdjunto: {
                            [Op.in]: Adjuntos.map(e => e.IdAdjunto)
                        }
                    }
                })

                await ProcesarStock({
                    IdTipoTransac: 'INC',
                    Cantidad: -Cantidad,
                    Tipo: 'INCIDENTE',
                    UsuarioCreacion: usuario_activo,
                    IdUsuario: id_usuario_activo,
                    IdEmpresa: id_empresa_activo,
                    IdAlmacenOrigen: IdAlmacen,
                    IdDetalleSolicitud: null,
                    IdNegocio: IdNegocio,
                    IdArticulo: IdArticulo,
                    ItemCode,
                    ItemName,
                    Devolucion: U_Devolucion,
                    Grupo: Grupo,
                    IdIncidente: newIncidente.IdIncidente
                })

                if (serie.IdControlSerie) {
                    await TransladoSerie(serie.IdControlSerie, IdParametro, 'NO DISPONIBLE')
                } else {
                    await AddStock(IdAlmacen, IdNegocio, IdArticulo, 'NO DISPONIBLE', Cantidad)
                }

                const data = await IncidenteRepository.findById(newIncidente.IdIncidente)
                await fetch(process.env.API_MAILING, {
                    method: 'POST',
                    body: JSON.stringify({
                        'email': user.correo,
                        'subject': 'INCIDENTE',
                        'template': 'incidente.template',
                        'data': data
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
            }
        } else {
            resultado.status = 'error'
            resultado.message = 'no se encontró stock'
        }
        res.json(resultado)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}
