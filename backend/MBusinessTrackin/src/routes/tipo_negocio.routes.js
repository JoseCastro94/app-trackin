import { Router } from "express"
import {
    createTipoNegocio,
    getTipoNegocios,
    getTipoNegocioUsuario,
    findApi,
    getTipoNegocio,
    getTipoNegocioAll,
    getUsuarioTipoNegocio,
    getTipoNegocioStocks,
    getStockNegocios
} from "../controllers/tipo_negocio.controller.js"

const router = Router()

router.post("/", createTipoNegocio)
router.post("/TipoNegocioUsuario", getTipoNegocioUsuario)
router.post("/TipoNegocio", getTipoNegocioAll)
router.post("/getTipoNegocio", getTipoNegocio)
router.post("/findApi", findApi)
router.post("/UsuarioTipoNegocio", getUsuarioTipoNegocio)
router.post("/getTipoNegocioStocks", getTipoNegocioStocks)
router.get("/getStockNegocios", getStockNegocios)



router.get("/", getTipoNegocios)

export default router