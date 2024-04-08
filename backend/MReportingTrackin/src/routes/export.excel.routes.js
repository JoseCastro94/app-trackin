import { Router } from 'express'
const router = Router()

import EntregaController from '../controllers/EntregaController.js'
import DevolucionController from '../controllers/DevolucionController.js'
import StockController from '../controllers/StockController.js'
import SolicitudController from '../controllers/SolicitudController.js'

router.post("/entregas", EntregaController.exportExcel)
router.post("/devoluciones", DevolucionController.exportExcel)
router.post("/stocks", StockController.exportExcel)
router.post("/solicitudes", SolicitudController.exportExcel)

export default router
