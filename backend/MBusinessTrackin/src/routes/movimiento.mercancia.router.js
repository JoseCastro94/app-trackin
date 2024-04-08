import { Router } from "express"
import controller from "../controllers/MovimientoMercanciaController.js";
import fileUpload from "express-fileupload";

const router = Router()

router.get('/', controller.index)
router.post('/', controller.create)
router.post("/upload-file", fileUpload(), controller.uploadFile)
router.post("/import-data", fileUpload(), controller.importData)

export default router