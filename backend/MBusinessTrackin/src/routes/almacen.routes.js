import { Router } from "express"
import {
    createAlmacen,
    getAlmacenes,
    getOwnAlmacen,
    getNotOwnAlmacen,
    getAlmacenEmpresa,
    getOwnJustAlmacen,
    getAnyJustAlmacen,
    getUsuarioAlmacen
} from "../controllers/almacen.controller.js"

const router = Router()

router.post("/", createAlmacen)
router.get("/", getAlmacenes)
router.get("/getAlmacenEmpresa", getAlmacenEmpresa)
router.post("/OwnAlmacen", getOwnAlmacen)
router.post("/NotOwnAlmacen", getNotOwnAlmacen)
router.post("/OwnJustAlmacen", getOwnJustAlmacen)
router.post("/AnyJustAlmacen", getAnyJustAlmacen)
router.post("/UsuarioAlmacen", getUsuarioAlmacen)


export default router