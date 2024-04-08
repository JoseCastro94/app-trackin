import ArchivoAdjuntoRepository from "../repositories/ArchivoAdjuntoRepository.js";
import BaseController from "./BaseController.js";
import S3 from "../utils/AwsS3.js";
import {v4 as uuidv4} from "uuid";

class ArchivoAdjuntoController extends BaseController {
    static listar = async (req, res) => {
        try {
            const {modulo, idModulo} = req.query
            const data = await ArchivoAdjuntoRepository.listar(modulo, idModulo)
            return this.successResponse(res, data)
        } catch (error) {
            return this.errorResponse(res, error)
        }
    }

    static create = async (req, res) => {
        const { user } = req.headers
        try {
            const { modulo, idModulo } = req.body
            const now = new Date()
            const year = now.getFullYear()
            const month = now.getMonth() + 1

            if (!req.files) {
                return this.errorResponse(res, {})
            }

            const { attached } = req.files
            const ext = String(attached.name).split('.').pop()
            const body = attached.data
            const key = `bucket-modulo-${modulo}/${year}/${month}/${uuidv4()}.${ext}`
            await S3.uploadFile(key, body)

            const data = await ArchivoAdjuntoRepository.create({
                Modulo: modulo,
                IdModulo: idModulo,
                Key: key,
                Nombre: attached.name,
                Ext: ext,
                Mime: attached.mimetype,
                UsuarioCreacion: user.username,
            })

            return this.createdResponse(res, { data })
        } catch (error) {
            return this.errorResponse(res, error)
        }
    }

    static destroy = async (req, res) => {
        try {
            const { id } = req.params
            const deleted = await ArchivoAdjuntoRepository.destroy(id)
            return this.deletedResponse(res, deleted)
        } catch (error) {
            return this.errorResponse(res, error)
        }
    }

    static download = async (req, res) => {
        const { id } = req.params

        try {
            const archivo = await ArchivoAdjuntoRepository.findById(id)
            S3.downloadFile(res, archivo.Key, archivo.Mime)
        } catch (error) {
            return this.errorResponse(res, error)
        }
    }
}

export default ArchivoAdjuntoController
