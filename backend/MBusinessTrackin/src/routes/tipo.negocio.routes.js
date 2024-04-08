import controller from '../controllers/TipoNegocioController.js'
import fileUpload from "express-fileupload";
import { Router } from "express"

const router = Router()

router.get("/", controller.listar)
router.get("/articulos/lista", controller.listarArticulos)
router.get("/listar", controller.listarNegociosConEmpresa)
router.post("/", controller.crear)
router.put("/:id", controller.update)
router.delete("/:id", controller.destroy)
router.post("/import-data", fileUpload(), controller.importData)

export default router