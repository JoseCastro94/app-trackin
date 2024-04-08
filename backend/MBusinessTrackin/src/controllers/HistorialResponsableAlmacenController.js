import HistorialResponsableAlmacenRepository from "../repositories/HistorialResponsableAlmacenRepository.js";
import {sequelize} from "../database/database.js";
import BaseController from "./BaseController.js";
import S3 from "../utils/AwsS3.js";
import Sequelize from "sequelize";
import {v4 as uuidv4} from "uuid";
import {generate} from "../helper/GeneratePDF.js";

class HistorialResponsableAlmacenController extends BaseController {
    static list = async (req, res) => {
        try {
            const data = await HistorialResponsableAlmacenRepository.list()
            return this.successResponse(res, data)
        } catch (error) {
            return this.errorResponse(res, error)
        }
    }

    static create = async (req, res) => {
        let transaction = await sequelize.transaction({
            autocommit: false,
            isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED
        })

        try {
            const {user, company} = req.headers
            const { body } = req
            const codigo = await HistorialResponsableAlmacenRepository.getCodigo()
            const detalle = body.articulos.map(articulo => {
                return {
                    ItemName: articulo.descripcion,
                    ItemCode: articulo.codigo,
                    Nombre_GrupArt: articulo.negocio,
                    EstadoStock: articulo.estado,
                    CantidadStock: articulo.stock,
                    CantidadRecibida: articulo.cantidad,
                    SerialNumber: articulo.serie,
                    Incidencia: articulo.incidencia,
                    UsuarioCreacion: user.username,
                    IdNegocio: articulo.id_negocio,
                }
            })
            const cabecera = {
                Codigo: codigo,
                DniResponsableIngresa: body.documento,
                FechaInicioResp: body.fecha_inicio,
                FechaFinResp: null,
                Estado: 'Activo',
                Email: body.correo,
                Attachment: body.attach,
                UsuarioCreacion: user.username,
                DetHistRespoAlmacens: detalle
            }
            const create = await HistorialResponsableAlmacenRepository.create(cabecera, transaction)
            await transaction.commit()
            return this.createdResponse(res)
        } catch (error) {
            await transaction.rollback()
            return this.errorResponse(res, error)
        }
    }

    static generarCargo = async (req, res) => {
        generate(req.body, res, 'cargo-relevo-responsable-almacen', 'cargo-relevo-responsable-almacen')
    }

    static uploadCargo = async (req, res) => {
        try {
            let now = new Date()
            let year = now.getFullYear()
            let month = now.getMonth() + 1
            let {attached} = req.files

            let ext = String(attached.name).split('.').pop()
            const body = attached.data
            const key = `cargo-relevo-almacen/${year}/${month}/${uuidv4()}.${ext}`
            await S3.uploadFile(key, body)
            // key = await S3.getUrlFile(key)
            return this.successResponse(res, { key })
        } catch (error) {
            return this.errorResponse(res, error)
        }
    }
}

export default HistorialResponsableAlmacenController
