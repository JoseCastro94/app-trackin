import { Router } from 'express'
const router = Router()

import EntregaController from '../controllers/EntregaController.js'
import DevolucionController from '../controllers/DevolucionController.js'
import StockController from '../controllers/StockController.js'
import SolicitudController from '../controllers/SolicitudController.js'

router.post("/entregas", EntregaController.listar)
router.post("/devoluciones", DevolucionController.listar)
router.post("/stocks", StockController.listar)
router.post("/solicitudes", SolicitudController.listar)

export default router
