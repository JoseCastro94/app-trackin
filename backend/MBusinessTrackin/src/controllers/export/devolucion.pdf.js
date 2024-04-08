import BaseController from "../BaseController.js";
import {generate} from "../../helper/GeneratePDF.js";

class DevolucionPdf extends BaseController {
    static generate = (req, res) => {
        generate(req.body, res, 'devolucion', 'devolucion')
    }
}

export default DevolucionPdf
