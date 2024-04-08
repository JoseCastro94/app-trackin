import { Router } from 'express'
const router = Router()

import MailController from '../controllers/MailController.js'

router.post("/send", MailController.send)

export default router
