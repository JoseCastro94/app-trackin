import { Router } from "express"
import EntregaPdf from "../controllers/export/entrega.pdf.js";
import IngresoMercanciaPdf from "../controllers/export/ingreso-mercancia.pdf.js";
import DevolucionPdf from "../controllers/export/devolucion.pdf.js";

const router = Router()

router.post('/entrega', EntregaPdf.generate)
// router.get('/entrega', EntregaPdf.generate)
router.post('/devolucion', DevolucionPdf.generate)
router.post('/ingreso-mercancia', IngresoMercanciaPdf.generate)

export default router