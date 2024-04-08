import { Router } from "express";
import controller from "../controllers/EmpresaController.js";
import fileUpload from "express-fileupload";

const router = Router()

router.post("/", fileUpload(), controller.importData)

export default router
