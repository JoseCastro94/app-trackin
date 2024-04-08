import {Router} from "express";
import DevolucionController from "../controllers/DevolucionController.js";

const router = Router()

router.post('/', DevolucionController.create)
router.post('/notificar', DevolucionController.notificarPorEmail)

export default router