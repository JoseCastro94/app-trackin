import { Router } from "express"

const router = Router()

router.get("/verify", (req, res) => {
    res.send("security tawa verify")
})

export default router