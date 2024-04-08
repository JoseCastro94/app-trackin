import { Router } from "express"
import {
    createArticulo,
    getArticulos,
    getArticulosUsuario,
    getGenericArticle,
    getArticles,
    getArticle,
} from "../controllers/articulo.controller.js"

const router = Router()

router.post("/", createArticulo)
router.post("/getGenericArticle", getGenericArticle)
router.post("/getArticles", getArticles)
router.post("/getArticle", getArticle)
router.post("/ArticulosUsuario", getArticulosUsuario(['DISPONIBLE']))
router.post("/ArticulosUsuarioAll", getArticulosUsuario(['DISPONIBLE', 'NO_DISPONIBLE']))

router.get("/", getArticulos)

export default router