import controller from "../controllers/ArchivoAdjuntoController.js"
import fileUpload from "express-fileupload";
import { Router } from "express"

const router = Router()

router.get("/", controller.listar)
router.get("/:id", controller.download)
router.post("/", fileUpload(), controller.create)
router.delete("/:id", controller.destroy)

export default router
