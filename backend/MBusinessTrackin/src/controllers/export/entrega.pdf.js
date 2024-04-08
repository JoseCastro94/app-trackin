import BaseController from "../BaseController.js";
import {generate} from "../../helper/GeneratePDF.js";

class EntregaPdf extends BaseController {
    static generate = (req, res) => {
        generate(req.body, res, 'entrega', 'entrega')
    }
}

export default EntregaPdf
