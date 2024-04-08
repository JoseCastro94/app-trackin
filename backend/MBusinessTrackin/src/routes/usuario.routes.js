import { Router } from "express"
import {
    createUsuario,
    getUsuarios,
    getMyInfo,
    getCostCenter,
    listarAlmacenes,
    getUsuariosAlmacenEnabled,
    getUsuariosEmpresa,
    getUsuarioGrupo,
    getUsuario,
    updUsuario,
    insUsuario,
} from "../controllers/usuario.controller.js"

import controller from "../controllers/UsuarioController.js"

import { empresaMiddleware } from '../middlewares/empresaMiddleware.js'

const router = Router()

router.post("/", empresaMiddleware, createUsuario)
router.post("/CostCenter", empresaMiddleware, getCostCenter)

router.get("/", empresaMiddleware, getUsuarios)
router.get("/MyInfo", empresaMiddleware, getMyInfo)
// TODO: Eliminar ruta /:id_usuario/almacenes
router.get("/:id_usuario/almacenes", empresaMiddleware, listarAlmacenes)
router.get("/almacenes", empresaMiddleware, listarAlmacenes)
router.get("/UsuariosAlmacenEnabled", empresaMiddleware, getUsuariosAlmacenEnabled)
router.get("/empresas", controller.listarEmpresas)
router.get("/responsables", empresaMiddleware, controller.listarResponsables)
router.get("/correos", empresaMiddleware, controller.listarCorreos)
router.get("/UsuariosEmpresa", empresaMiddleware, getUsuariosEmpresa)
router.post("/UsuarioGrupo", empresaMiddleware, getUsuarioGrupo)
router.post("/Usuario", empresaMiddleware, getUsuario)
router.post("/updUsuario", empresaMiddleware, updUsuario)
router.post("/insUsuario", empresaMiddleware, insUsuario)

export default router
