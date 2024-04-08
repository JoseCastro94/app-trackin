import { Router } from "express"
import controller from "../controllers/AlmacenController.js"
import fileUpload from "express-fileupload";

const router = Router()

router.get("/", controller.listar)
router.post("/", controller.crear)
router.put("/", controller.update)
router.delete("/:id", controller.destroy)
router.post("/import-data", fileUpload(), controller.importData)

export default router