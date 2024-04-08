import EntregaController from "../controllers/EntregaController.js";
import {Router} from "express";

const router = Router()

router.post('/', EntregaController.create)
router.delete('/:id', EntregaController.delete)
router.post('/notificar', EntregaController.notificarPorEmail)

export default router