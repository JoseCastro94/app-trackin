import { Router } from "express"
import {
    createEmpresaParametro,
    getEmpresaParametros,
    getMyEmpresa,
    getUsuarioEmpresa,
} from "../controllers/empresa_parametros.controller.js"

const router = Router()

router.post("/", createEmpresaParametro)
router.get("/", getEmpresaParametros)
router.get("/getMyEmpresa", getMyEmpresa)
router.post("/UsuarioEmpresa", getUsuarioEmpresa)

export default router