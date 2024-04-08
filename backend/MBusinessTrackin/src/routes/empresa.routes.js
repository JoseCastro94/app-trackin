import { Router } from "express";
import controller from "../controllers/EmpresaController.js";

import { empresaMiddleware } from '../middlewares/empresaMiddleware.js'

const router = Router()

router.get("/", empresaMiddleware, controller.listar)
router.post("/:ruc", controller.findByRuc)
router.post("/", empresaMiddleware, controller.crear)
router.put("/", empresaMiddleware, controller.update)
router.delete("/:id", empresaMiddleware, controller.destroy)

export default router
