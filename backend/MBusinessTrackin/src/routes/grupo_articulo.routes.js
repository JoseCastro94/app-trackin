import { Router } from "express"
import {
    createGrupoArticulo,
    getGrupoArticulos
} from "../controllers/grupo_articulo.controller.js"

const router = Router()

router.post("/", createGrupoArticulo)
router.get("/", getGrupoArticulos)

export default router