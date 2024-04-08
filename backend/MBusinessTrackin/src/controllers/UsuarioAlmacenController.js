import UsuarioAlmacenRepository from "../repositories/UsuarioAlmacenRepository.js";
import BaseController from "./BaseController.js";

class UsuarioAlmacenController extends BaseController {
    static listarResponsables = async (req, res) => {
        try {
            const {company} = req.headers
            let data = await UsuarioAlmacenRepository.listarResponsables(company.id)
            return this.successResponse(res, data)
        } catch (error) {
            return this.errorResponse(res, error)
        }
    }
}

export default UsuarioAlmacenController
