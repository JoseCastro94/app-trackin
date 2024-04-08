import { EvaluacionArticulo } from '../models/EvaluacionArticulo.js'
import { EvaluacionAdjunto } from '../models/EvaluacionAdjunto.js'
import Sequelize, { Op } from "sequelize"
import { Parametro } from '../models/Parametro.js'
import { DetalleDespachoSolicitud } from '../models/DetalleDespachoSolicitud.js'
import { ProcesarStock } from '../operations/stocks.js'
import {
    ESTADO_EVALUACION,
    ESTADO_EVALUACION_CONCLUSION,
} from '../storage/const.js'
import { DetalleSolicitudArticulo } from '../models/DetalleSolicitudArticulo.js'
import { ArticuloNegocio } from '../models/ArticuloNegocio.js'
import { Articulo } from '../models/Articulo.js'
import { GrupoArticulo } from '../models/GrupoArticulo.js'

//const usuario_activo = "45631343"

export const insEvaluacion = async (req, res) => {
    const { user } = req.headers
    const usuario_activo = user.username

    try {
        const {
            comentario,
            estado,
            conclusion,
            codigo,
            archivos,
            cantidad,
        } = req.body

        let resultado = {
            status: 'Ok',
            message: 'Se insertó la evaluación técnica correctamente'
        }

        let now = new Date()
        let year = now.getFullYear()

        let last_corr = await EvaluacionArticulo.max('Correlativo', {
            where: {
                Periodo: year
            }
        })

        let corr = 1

        if (last_corr) {
            corr = last_corr + 1
        }

        let newEvaluacion = await EvaluacionArticulo.create({
            Comentario: comentario,
            IdParametro: estado,
            IdDetalleDespacho: codigo,
            Cantidad: cantidad,
            IdConclusion: conclusion,
            UsuarioCreacion: usuario_activo,
            UsuarioModifica: usuario_activo,
            Periodo: year,
            Correlativo: corr,
        })

        await EvaluacionAdjunto.update({
            IdEvaluacion: newEvaluacion.IdEvaluacion
        }, {
            where: {
                IdAdjunto: {
                    [Op.in]: archivos.map(e => e.IdAdjunto)
                }
            }
        })

        res.json(resultado)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

export const getEvaluacion = async (req, res) => {
    const {
        IdDetalleDespacho
    } = req.params

    try {
        const evaluaciones = await EvaluacionArticulo.findAll({
            attributes: [
                ["IdEvaluacion", "id"],
                "Comentario",
                "FechaEvaluacion",
                "Cantidad",
                "Periodo",
                "Correlativo",
                "IdParametro",
                [Sequelize.col('Conclusion.Nombre'), "Veredicto"],
                [Sequelize.col('Parametro.Nombre'), "Estado"],
            ],
            include: [
                {
                    model: Parametro,
                    attributes: [],
                    as: 'Conclusion'
                },
                {
                    model: Parametro,
                    attributes: [],
                },
            ],
            where: {
                IdDetalleDespacho
            }
        })
        res.json(evaluaciones)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

export const getEvaluacionDeep = async (req, res) => {
    const {
        IdEvaluacion
    } = req.params

    try {
        const evaluaciones = await EvaluacionArticulo.findOne({
            attributes: [
                ["IdEvaluacion", "id"],
                "Comentario",
                "FechaEvaluacion",
                "IdParametro",
                "Cantidad",
                "Periodo",
                "Correlativo",
                "IdConclusion",
            ],
            include: [
                {
                    model: EvaluacionAdjunto
                }
            ],
            where: {
                IdEvaluacion
            }
        })
        res.json(evaluaciones)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

export const delEvaluacion = async (req, res) => {
    const {
        IdEvaluacion
    } = req.params

    let resultado = {
        status: 'Ok',
        message: 'Se eliminó la evaluación técnica correctamente'
    }

    try {
        await EvaluacionArticulo.destroy({
            where: {
                IdEvaluacion
            }
        })

        await EvaluacionAdjunto.destroy({
            where: {
                IdEvaluacion
            }
        })
        res.json(resultado)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

export const updEvaluacion = async (req, res) => {
    const { user } = req.headers
    const usuario_activo = user.username

    try {
        const {
            comentario,
            estado,
            conclusion,
            archivos,
            id,
            cantidad,
        } = req.body

        let resultado = {
            status: 'Ok',
            message: 'Se actualizó la evaluación técnica correctamente'
        }

        await EvaluacionArticulo.upsert({
            IdEvaluacion: id,
            Comentario: comentario,
            Cantidad: cantidad,
            IdParametro: estado,
            IdConclusion: conclusion,
            UsuarioModifica: usuario_activo,
            FechaModifica: new Date()
        })

        const ins = archivos.map(element => {
            element.IdEvaluacion = id
            return element
        })

        await EvaluacionAdjunto.destroy({
            where: {
                IdAdjunto: {
                    [Op.in]: archivos.map(e => e.IdAdjunto)
                }
            }
        })

        await EvaluacionAdjunto.bulkCreate(ins)

        res.json(resultado)
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: e.message });
    }
}

export const procEvaluacion = async (req, res) => {
    const {
        IdDetalleDespacho
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
        const find_detalle_despacho = await DetalleDespachoSolicitud.findOne({
            attributes: [
                "IdDetalleDespacho",
                "IdDespacho",
                "ItemCode",
                "ItemName",
                "U_BPP_TIPUNMED",
                "Cantidad",
                "CantidadPicking",
                "CantidadEntrega",
                "CantidadPendienteEvaluar",
                "CantidadEvaluado",
                "EstadoEvaluado",
            ],
            include: {
                model: DetalleSolicitudArticulo,
                include: {
                    model: ArticuloNegocio,
                    include: {
                        model: Articulo,
                        include: {
                            model: GrupoArticulo
                        }
                    }
                }
            },
            where: {
                IdDetalleDespacho: IdDetalleDespacho
            }
        })

        const find_evaluaciones = await EvaluacionArticulo.findAll({
            attributes: [
                "IdEvaluacion",
                "Periodo",
                "Correlativo",
                "FechaEvaluacion",
                "Comentario",
                "Cantidad",
                "IdConclusion",
                "IdParametro",
            ],
            where: {
                IdDetalleDespacho: IdDetalleDespacho,
            }
        })

        const sum_eval = find_evaluaciones
            .filter(f => (
                f.IdParametro === ESTADO_EVALUACION.EVALUADO
                && (
                    f.IdConclusion === ESTADO_EVALUACION_CONCLUSION.DISPONIBLE ||
                    f.IdConclusion === ESTADO_EVALUACION_CONCLUSION.NO_DISPONIBLE
                )
            ))
            .reduce((accumulator, object) => {
                return accumulator + object.Cantidad
            }, 0)

        if (find_detalle_despacho.CantidadEntrega === sum_eval) {
            const find_to_disponible = find_evaluaciones.filter(f =>
                f.IdConclusion === ESTADO_EVALUACION_CONCLUSION.DISPONIBLE &&
                f.IdParametro === ESTADO_EVALUACION.EVALUADO)

            const cantidad_evaluado = find_to_disponible.reduce((accumulator, object) => {
                return accumulator + object.Cantidad
            }, 0)

            await ProcesarStock({
                IdTipoTransac: 'REING',
                Cantidad: cantidad_evaluado,
                Tipo: 'REINGRESO',
                UsuarioCreacion: usuario_activo,
                IdUsuario: id_usuario_activo,
                IdEmpresa: id_empresa_activo,
                IdAlmacenOrigen: find_detalle_despacho.DetalleSolicitudArticulo.IdAlmacen,
                IdNegocio: find_detalle_despacho.DetalleSolicitudArticulo.IdNegocio,
                IdArticulo: find_detalle_despacho.DetalleSolicitudArticulo.ArticuloNegocio.IdArticulo,
                ItemCode: find_detalle_despacho.DetalleSolicitudArticulo.ItemCode,
                ItemName: find_detalle_despacho.DetalleSolicitudArticulo.ItemName,
                Devolucion: find_detalle_despacho.DetalleSolicitudArticulo.U_BPP_DEVOL,
                Grupo: find_detalle_despacho.DetalleSolicitudArticulo.ArticuloNegocio.Articulo.GrupoArticulo.Nombre,
                TipoStock: 'NO DISPONIBLE',
                TransferStock: 'DISPONIBLE'
            })

            find_detalle_despacho.EstadoEvaluado = true
            find_detalle_despacho.CantidadPendienteEvaluar = find_detalle_despacho.CantidadPendienteEvaluar - cantidad_evaluado
            find_detalle_despacho.CantidadEvaluado = find_detalle_despacho.CantidadEvaluado + cantidad_evaluado
            find_detalle_despacho.UsuarioModifica = usuario_activo
            find_detalle_despacho.FechaModifica = new Date()
            find_detalle_despacho.save()
        } else {
            resultado.status = 'error'
            resultado.message = 'La cantidad de articulos registrados y concluidos deben de ser igual a la cantidad entregada'
        }
        res.json(resultado)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}