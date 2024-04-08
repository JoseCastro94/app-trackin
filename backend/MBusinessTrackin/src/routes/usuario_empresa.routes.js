import { Router } from "express"
import {
    updUsuarioEmpresa
} from "../controllers/usuario_empresa.controller.js"

const router = Router()

router.post("/updUsuarioEmpresa", updUsuarioEmpresa)

export default router