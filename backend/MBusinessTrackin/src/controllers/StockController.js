import BaseController from "./BaseController.js";
import StockRepository from "../repositories/StockRepository.js";

class StockController extends BaseController {
    static listar = async (req, res) => {
        try {
            const { id_almacen } = req.query
            const filter = id_almacen ? {IdAlmacen: id_almacen} : null
            const data = await StockRepository.listar(filter)
            return this.successResponse(res, data)
        } catch (e) {
            return this.errorResponse(res, e)
        }
    }

    static listarEstados = async (req, res) => {
        try {
            const data = await StockRepository.listarEstados()
            return this.successResponse(res, data)
        } catch (e) {
            return this.errorResponse(res, e)
        }
    }
}

export default StockController
