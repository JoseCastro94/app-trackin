import { Router } from "express"
import {
    create,
    list,
    getOne,
} from '../controllers/guia_remision.controller.js'

const router = Router()

router.post("/", create)
router.post("/list", list)
router.post("/getOne", getOne)

export default router