import { Router } from "express"
import controller from "../controllers/GrupoArticuloController.js"
import fileUpload from "express-fileupload";

const router = Router()

router.get("/", controller.listar)
router.get("/listar", controller.listarPaginacion)
router.post("/", controller.crear)
router.put("/:id", controller.update)
router.delete("/:id", controller.destroy)
router.post("/import-data", fileUpload(), controller.importData)

export default router
