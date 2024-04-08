import { Router } from "express"
import controller from "../controllers/ArticuloController.js"
import fileUpload from "express-fileupload";

const router = Router()

router.get("/", controller.listar)
// router.get("/negocio/lista", controller.listarNegocios)
router.post("/", fileUpload(), controller.crear)
router.put("/", fileUpload(), controller.update)
router.put("/eliminar", controller.eliminar)
router.post("/import-data", fileUpload(), controller.importData)
router.get("/download-file/:id", controller.downloadFichaTecnica)

export default router
