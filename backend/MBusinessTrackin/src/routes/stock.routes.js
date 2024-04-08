import {Router} from "express";
import controller from "../controllers/StockController.js"
const router = Router()

router.get('/', controller.listar)
router.get('/estados', controller.listarEstados)

export default router
