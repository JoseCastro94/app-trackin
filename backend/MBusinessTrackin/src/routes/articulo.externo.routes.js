import { Router } from "express"
import service from "../services/GrupoTawa/ArticuloService.js"

const router = Router()

router.get("/list", service.listar)
router.post("/", service.buscarPorCodigo)

export default router
