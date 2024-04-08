import {Router} from "express";
import controller from "../controllers/HistorialResponsableAlmacenController.js"
import fileUpload from "express-fileupload";

const router = Router()

router.get("/", controller.list)
router.post("/", controller.create)
router.post("/generar-cargo", controller.generarCargo)
router.post("/subir-cargo", fileUpload(), controller.uploadCargo)

export default router