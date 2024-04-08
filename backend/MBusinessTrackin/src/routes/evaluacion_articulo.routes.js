import { Router } from "express"
import {
    insEvaluacion,
    getEvaluacion,
    delEvaluacion,
    getEvaluacionDeep,
    updEvaluacion,
    procEvaluacion,
} from "../controllers/evaluacion_articulo.controller.js"

const router = Router()

router.post("/ins", insEvaluacion)
router.post("/upd", updEvaluacion)
router.post("/procEvaluacion", procEvaluacion)
router.get("/Detalle/:IdDetalleDespacho", getEvaluacion)
router.get("/Deep/:IdEvaluacion", getEvaluacionDeep)
router.delete("/Remove/:IdEvaluacion", delEvaluacion)

export default router