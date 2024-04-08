import { Router } from "express"
import {
    getDepartamento,
    getProvincia,
    getDistrito,
    getUbigeo,
} from "../controllers/ubigeo.controller.js"

const router = Router()

router.post("/getDepartamento", getDepartamento)
router.post("/getProvincia", getProvincia)
router.post("/getDistrito", getDistrito)
router.post("/getUbigeo", getUbigeo)

export default router