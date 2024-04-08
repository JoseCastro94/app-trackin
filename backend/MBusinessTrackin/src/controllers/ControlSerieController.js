import BaseController from "./BaseController.js";
import ControlSerieRepository from "../repositories/ControlSerieRepository.js";

class ControlSerieController extends BaseController {
    static list = async (req, res) => {
        const {body} = req
        try {
            console.dir('ControlSerieController-list ');
            console.dir('body.id_almacen: ' + body.id_almacen);
            console.dir('body.id_negocio: ' + body.id_negocio);
            console.dir('body.id_articulo: ' + body.id_articulo);
            console.dir('body.series: ' + body.series);
            const data = await ControlSerieRepository.list(
                body.id_almacen,
                body.id_negocio,
                body.id_articulo,
                body.series,
            )

            console.dir(data);
            return this.successResponse(res, data)
        } catch (e) {
            return this.errorResponse(res,  e)
        }
    }
}

export  default ControlSerieController