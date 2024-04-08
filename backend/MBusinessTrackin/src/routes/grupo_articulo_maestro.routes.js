import { Router } from "express"
import {
    getGrupoArticuloMaestros
} from "../controllers/grupo_articulo_maestro.controller.js"

const router = Router()

router.get("/", getGrupoArticuloMaestros)

export default router