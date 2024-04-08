import { Router } from "express"
import controller from "../controllers/ControlSerieController.js"
import {
    getListByWarehouse,
    getListByArticle,
    getListByStockType
} from "../controllers/control_serie.controller.js"
const router = Router()

router.post("/", controller.list)
router.post("/ListByWarehouse", getListByWarehouse)
router.post("/ListByArticle", getListByArticle)
router.post("/ListByStockType", getListByStockType)

export default router