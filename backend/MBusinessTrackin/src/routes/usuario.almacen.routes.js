import { Router } from "express"
import controller from "../controllers/UsuarioAlmacenController.js"

const router = Router()

router.get("/responsables", controller.listarResponsables)

export default router
