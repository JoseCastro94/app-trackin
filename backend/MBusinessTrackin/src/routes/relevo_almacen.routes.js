import { Router } from "express"
import {
    insRelevoAlmacen,
    updateCheck,
    getOne,
    getDetail,
    getInfo,
    procesarRelevo,
    cargo,
    delRelevo,
} from '../controllers/relevo_almacen.controller.js'

const router = Router()

router.post("/ins", insRelevoAlmacen)
router.post("/updateCheck", updateCheck)
router.post("/getOne", getOne)
router.post("/getDetail", getDetail)
router.post("/getInfo", getInfo)
router.post("/procesarRelevo", procesarRelevo)
router.post("/cargo", cargo)
router.post("/delRelevo", delRelevo)

export default router