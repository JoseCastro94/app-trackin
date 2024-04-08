import { Router } from "express"
import {
    getParametroByGrupo
} from "../controllers/parametro.controller.js"
import controller from "../controllers/ParametroController.js";
import fileUpload from "express-fileupload";

const router = Router()

router.post("/ParametroByGrupo/:IdGrupo", getParametroByGrupo)
router.get("/", controller.listar)
router.post("/", controller.crear)
router.put("/", controller.update)
router.delete("/:id", controller.destroy)
router.post("/import-data", fileUpload(), controller.importData)

export default router