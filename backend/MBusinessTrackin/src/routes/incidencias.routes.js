import { Router } from "express"
import {
    getIncidentes,
    insIncidente,
} from "../controllers/Incidencias.controller.js"

const router = Router()

router.post("/get", getIncidentes)
router.post("/ins", insIncidente)

export default router