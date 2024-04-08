import jwt from "jsonwebtoken"

export const verifyToken = async (req, res, next) => {
    let token = req.headers["token"]

    token = String(token).substring(7)

    try {
        const decoded = jwt.verify(token, process.env.SECRET)
        const user = decoded.data
        req.headers = {...req.headers, user}
        next()
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: "Unauthorized!" })
    }
};