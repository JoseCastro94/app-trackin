import { Router } from "express"
import {
    createUsuarioNegocio,
    getUsuarioNegocios,
    updUsuarioNegocio,
} from "../controllers/usuario_negocio.controller.js"

const router = Router()

router.post("/", createUsuarioNegocio)
router.post("/updUsuarioNegocio", updUsuarioNegocio)
router.get("/", getUsuarioNegocios)

export default router