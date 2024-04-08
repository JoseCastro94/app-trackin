import { Router } from "express"
import {
    getGrupoTrabajador,
    getGrupoTrabajadorFull,
    updGrupoTrabajador,
} from "../controllers/grupo_trabajador.controller.js"

const router = Router()

router.get("/", getGrupoTrabajador)
router.post("/GrupoTrabajadorFull", getGrupoTrabajadorFull)
router.post("/updGrupoTrabajador", updGrupoTrabajador)

export default router