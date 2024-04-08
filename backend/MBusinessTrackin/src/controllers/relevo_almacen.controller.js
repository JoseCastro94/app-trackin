import { RelevoAlmacen } from '../models/RelevoAlmacen.js'
import { DetalleRelevoAlmacen } from '../models/DetalleRelevoAlmacen.js'
import { Almacen } from '../models/Almacen.js'
import { UsuarioAlmacen } from '../models/UsuarioAlmacen.js'
import { Stock } from '../models/Stock.js'
import { Articulo } from '../models/Articulo.js'
import { TipoNegocio } from '../models/TipoNegocio.js'
import { GrupoArticulo } from '../models/GrupoArticulo.js'
import { Usuario } from '../models/Usuario.js'
import { Parametro } from '../models/Parametro.js'

import Sequelize, { Op } from "sequelize"

import { generate } from '../helper/GeneratePDF.js'

import { STATUS_RELEVO, TYPE_STOCK } from '../storage/const.js'

export const insRelevoAlmacen = async (req, res) => {
    const {
        IdAlmacen,
        IdUsuarioDestino,
    } = req.body

    const { user, company } = req.headers
    const usuario_activo = user.username
    const id_usuario_activo = user.id_user
    const id_empresa_activo = company.id

    let resultado = {
        status: 'Ok',
        message: 'Se insertó la solicitud correctamente'
    }

    try {
        const findRelevoPendiente = await RelevoAlmacen.findOne({
            where: {
                IdAlmacen: IdAlmacen,
                IdParametro: STATUS_RELEVO.PENDIENTE
            }
        })

        if (findRelevoPendiente) {
            resultado.message = 'Ya existe un proceso de relevamiento para el almacen seleccionado'
            resultado.status = 'error'
        } else {
            const findRelevoActivo = await RelevoAlmacen.findOne({
                attributes: [
                    "IdUsuarioDestino"
                ],
                where: {
                    IdAlmacen: IdAlmacen,
                    IdParametro: STATUS_RELEVO.ACTIVO
                }
            })

            let IdUsuarioOrigen = null
            if (findRelevoActivo) {
                IdUsuarioOrigen = findRelevoActivo.IdUsuarioDestino
            }

            const findStock = await Stock.findAll({
                attributes: [
                    "IdStock",
                    "Cantidad",
                    "Tipo",
                    "IdAlmacen",
                    "IdNegocio",
                    "IdArticulo",
                    [Sequelize.col('Articulo.ItemCode'), "CodigoArticulo"],
                    [Sequelize.col('Articulo.ItemName'), "DescripcionArticulo"],
                    [Sequelize.col('Articulo.GrupoArticulo.Nombre'), "CategoriaArticulo"],
                    [Sequelize.col('Articulo.GrupoArticulo.TieneSerie'), "IsControlSerie"],
                    [Sequelize.col('TipoNegocio.Nombre'), "Negocio"],
                ],
                where: {
                    IdAlmacen: IdAlmacen,
                    Cantidad: {
                        [Op.not]: 0
                    },
                    Tipo: {
                        [Op.in]: [
                            TYPE_STOCK.COMPROMETIDO,
                            TYPE_STOCK.DISPONIBLE,
                            TYPE_STOCK.EN_EVALUACION
                        ]
                    }
                },
                include: [
                    {
                        model: Articulo,
                        attributes: [],
                        include: {
                            model: GrupoArticulo,
                            attributes: [],
                        }
                    }, {
                        model: TipoNegocio,
                        attributes: [],
                    }
                ]
            })

            const jsonStock = findStock.map(element => {
                let stock = { ...element.toJSON() }
                stock.UsuarioCreacion = usuario_activo
                stock.UsuarioModifica = usuario_activo
                stock.IdEmpresa = id_empresa_activo
                return stock
            })

            let now = new Date()
            let year = now.getFullYear()

            let last_corr = await RelevoAlmacen.max('Correlativo', {
                where: {
                    IdEmpresa: id_empresa_activo,
                    Periodo: year
                }
            })

            let corr = 1

            if (last_corr) {
                corr = last_corr + 1
            }

            const procRelevo = await RelevoAlmacen.create({
                UsuarioCreacion: usuario_activo,
                UsuarioModifica: usuario_activo,
                IdUsuarioOrigen: IdUsuarioOrigen,
                IdUsuarioDestino: IdUsuarioDestino,
                IdAlmacen: IdAlmacen,
                IdParametro: STATUS_RELEVO.PENDIENTE,
                IdEmpresa: id_empresa_activo,
                Periodo: year,
                Correlativo: corr,
                DetalleRelevoAlmacens: jsonStock
            }, {
                include: {
                    model: DetalleRelevoAlmacen
                }
            })

            const detalle = procRelevo.DetalleRelevoAlmacens.map(element => {
                const detalle = { ...element.toJSON() }
                detalle.id = detalle.IdDetalleRelevoAlmacen
                detalle.CantidadActual = detalle.Cantidad
                return detalle
            })


            resultado.relevo = detalle
            resultado.IdRelevoAlmacen = procRelevo.IdRelevoAlmacen
        }
        res.status(200).json(resultado)
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: e.message });
    }
}


export const updateCheck = async (req, res) => {
    const {
        IdRelevoAlmacen,
        lista
    } = req.body

    try {
        await DetalleRelevoAlmacen.update({
            Check: true
        }, {
            where: {
                IdRelevoAlmacen: IdRelevoAlmacen,
                IdDetalleRelevoAlmacen: {
                    [Op.in]: lista
                }
            }
        })

        await DetalleRelevoAlmacen.update({
            Check: false
        }, {
            where: {
                IdRelevoAlmacen: IdRelevoAlmacen,
                IdDetalleRelevoAlmacen: {
                    [Op.notIn]: lista
                }
            }
        })

        res.status(200).json({
            status: 'Ok',
            message: 'Actualizado correctamente'
        })
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: e.message });
    }
}


export const getOne = async (req, res) => {
    const {
        IdRelevoAlmacen,
    } = req.body

    try {
        const find = await RelevoAlmacen.findByPk(IdRelevoAlmacen, {
            attributes: [
                "IdAlmacen",
                [Sequelize.col('UsuarioDestino.IdUsuario'), "IdUsuario"],
                [Sequelize.col('UsuarioDestino.NroDocumento'), "NroDocumento"],
                [Sequelize.col('UsuarioDestino.ApellidoPaterno'), "ApellidoPaterno"],
                [Sequelize.col('UsuarioDestino.ApellidoMaterno'), "ApellidoMaterno"],
                [Sequelize.col('UsuarioDestino.Nombres'), "Nombres"],
            ],
            include: {
                model: Usuario,
                as: 'UsuarioDestino',
                attributes: []
            }
        })

        res.status(200).json(find)
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: e.message });
    }
}

export const getDetail = async (req, res) => {
    const {
        IdRelevoAlmacen,
    } = req.body

    try {
        const find = await DetalleRelevoAlmacen.findAll({
            attributes: [
                ["IdDetalleRelevoAlmacen", "id"],
                "Cantidad",
                "Tipo",
                "CodigoArticulo",
                "DescripcionArticulo",
                "CategoriaArticulo",
                "Negocio",
                "Check",
                "IsControlSerie",
                "IdRelevoAlmacen",
                "IdStock",
                "IdAlmacen",
                "IdNegocio",
                "IdEmpresa",
                "IdArticulo",
                [Sequelize.col('Stock.Cantidad'), "CantidadActual"],
            ],
            where: {
                IdRelevoAlmacen
            },
            include: {
                model: Stock,
                attributes: []
            },
            order: [['Check', 'DESC']],
        })

        const checked = find
            .filter(f => f.Check === true)
            .map(e => {
                const j = e.toJSON()
                return j.id
            })

        res.status(200).json({
            list: find,
            checked: checked
        })
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: e.message });
    }
}


export const getInfo = async (req, res) => {
    const {
        IdAlmacen,
    } = req.body

    const { company } = req.headers
    const id_empresa_activo = company.id

    try {
        const find = await RelevoAlmacen.findAll({
            attributes: [
                ["IdRelevoAlmacen", "id"],
                "Periodo",
                "Correlativo",
                "FechaInicio",
                "FechaFin",
                [Sequelize.col('UsuarioDestino.ApellidoPaterno'), "ApellidoPaterno"],
                [Sequelize.col('UsuarioDestino.ApellidoMaterno'), "ApellidoMaterno"],
                [Sequelize.col('UsuarioDestino.Nombres'), "Nombres"],
                [Sequelize.col('UsuarioDestino.NroDocumento'), "NroDocumento"],
                [Sequelize.col('Parametro.Nombre'), "Estado"],
                "IdParametro",
            ],
            include: [{
                model: Usuario,
                as: 'UsuarioDestino',
                attributes: []
            }, {
                model: Parametro,
                attributes: []
            }],
            where: {
                IdAlmacen: IdAlmacen,
                IdEmpresa: id_empresa_activo
            },
            order: [
                ['Periodo', 'DESC'],
                ['Correlativo', 'DESC'],
            ],
        })

        res.status(200).json(find)
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: e.message });
    }
}

export const procesarRelevo = async (req, res) => {
    const {
        IdRelevoAlmacen,
        Comentario,
    } = req.body

    const { user, company } = req.headers
    const usuario_activo = user.username

    let resultado = {
        status: 'Ok',
        message: 'Se insertó la solicitud correctamente'
    }

    try {
        const findReleve = await RelevoAlmacen.findByPk(IdRelevoAlmacen)
        if (findReleve) {
            if (findReleve.IdParametro === STATUS_RELEVO.PENDIENTE) {
                const findDetail = await DetalleRelevoAlmacen.findAll({
                    where: {
                        IdRelevoAlmacen: findReleve.IdRelevoAlmacen,
                        Check: false
                    }
                })
                if (findDetail.length > 0) {
                    resultado.message = 'Debe de revisar todos los items para procesar'
                    resultado.status = 'Error'
                } else {
                    await RelevoAlmacen.update({
                        IdParametro: STATUS_RELEVO.INACTIVO,
                        FechaFin: new Date(),
                        UsuarioModifica: usuario_activo,
                        FechaModifica: new Date()
                    }, {
                        where: {
                            IdParametro: STATUS_RELEVO.ACTIVO,
                            IdAlmacen: findReleve.IdAlmacen
                        }
                    })

                    findReleve.FechaInicio = new Date()
                    findReleve.Comentario = Comentario
                    findReleve.IdParametro = STATUS_RELEVO.ACTIVO
                    findReleve.UsuarioModifica = usuario_activo
                    findReleve.FechaModifica = new Date()
                    await findReleve.save()

                    await UsuarioAlmacen.destroy({
                        where: {
                            IdAlmacen: findReleve.IdAlmacen,
                            IsAdmin: true
                        }
                    })

                    await UsuarioAlmacen.create({
                        Observacion: Comentario,
                        UsuarioCreacion: usuario_activo,
                        UsuarioModifica: usuario_activo,
                        IdUsuario: findReleve.IdUsuarioDestino,
                        IdAlmacen: findReleve.IdAlmacen,
                        IsAdmin: true
                    })
                }
            } else {
                resultado.message = 'El relevo no está en estado pendiente'
                resultado.status = 'Error'
            }
        } else {
            resultado.message = 'No se encontró el registro'
            resultado.status = 'Error'
        }
        res.status(200).json(resultado)
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: e.message });
    }
}


export const cargo = async (req, res) => {
    const {
        IdRelevoAlmacen
    } = req.body

    try {
        const findRelevo = await RelevoAlmacen.findByPk(IdRelevoAlmacen, {
            include: [{
                model: DetalleRelevoAlmacen,
                include: {
                    model: Stock
                }
            }, {
                model: Almacen
            }, {
                model: Usuario,
                as: 'UsuarioDestino',
            }]
        })
        const data = findRelevo.toJSON()
        generate(data, res, 'cargo_relevo', 'cargo_relevo')
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: e.message });
    }
}

export const delRelevo = async (req, res) => {
    const {
        IdRelevoAlmacen
    } = req.body

    let resultado = {
        status: 'Ok',
        message: 'Se insertó la solicitud correctamente'
    }

    try {
        const find_pendiente = await RelevoAlmacen.findOne({
            where: {
                IdRelevoAlmacen: IdRelevoAlmacen,
                IdParametro: STATUS_RELEVO.PENDIENTE
            }
        })

        if (find_pendiente) {
            await DetalleRelevoAlmacen.destroy({
                where: {
                    IdRelevoAlmacen: IdRelevoAlmacen,
                }
            })

            await find_pendiente.destroy()
        } else {
            resultado.message = 'No se encontró el relevo'
            resultado.status = 'Error'
        }

        res.status(200).json(resultado)
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: e.message });
    }
}