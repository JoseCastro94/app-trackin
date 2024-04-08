import BaseController from "../BaseController.js";
import {generate} from "../../helper/GeneratePDF.js";

class IngresoMercanciaPDF extends BaseController {
    static generate = (req, res) => {
        generate(req.body, res, 'ingreso-mercancia', 'ingreso-mercancia')
    }
}

export default IngresoMercanciaPDF
