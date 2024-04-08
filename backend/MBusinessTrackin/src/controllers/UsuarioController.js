import BaseController from "./BaseController.js";
import UsuarioRepository from "../repositories/UsuarioRepository.js";

class UsuarioController extends BaseController {
    static listarResponsables = async (req, res) => {
        try {
            const data = await UsuarioRepository.listarResponsables()
            return this.successResponse(res, data)
        } catch (error) {
            return this.errorResponse(res, error)
        }
    }

    static listarEmpresas = async (req, res) => {
        try {
            const {user} = req.headers
            const data = await UsuarioRepository.listarEmpresas(user.id_user)
            return this.successResponse(res, data)
        } catch (error) {
            return this.errorResponse(res, error)
        }
    }

    static listarCorreos = async (req, res) => {
        try {
            const { company } = req.headers
            const data = await UsuarioRepository.listarCorreos(company.id)
            return this.successResponse(res, data)
        } catch (error) {
            return this.errorResponse(res, error)
        }
    }
}

export default UsuarioController
