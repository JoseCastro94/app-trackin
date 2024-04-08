import { Router } from "express"
import {
    createArticuloNegocio,
    getArticuloNegocios
} from "../controllers/articulo_negocio.controller.js"
import controller from "../controllers/ArticuloNegocioController.js"

const router = Router()

router.post("/", createArticuloNegocio)
router.get("/", getArticuloNegocios)
router.get("/articulo/:id_articulo/negocios", controller.buscarNegociosPorArticulo)
router.get("/articulo/:id_articulo/negociosnew", controller.buscarNegociosPorArticuloNew)
router.get("/articulo/:id_articulo/:id_negocio/idarticuloreal", controller.buscarArticuloReal)
router.get("/articulos", controller.listarArticulos)
router.get("/articulosnew", controller.listarArticulosNew)


export default router