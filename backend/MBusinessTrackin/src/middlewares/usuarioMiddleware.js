import jwt from 'jsonwebtoken'
import UsuarioRepository from "../repositories/UsuarioRepository.js";

const verifyToken = (token, secret) => {
    try {
        return jwt.verify(token, secret)
    } catch (e) {
        return null
    }
}

export const usuarioMiddleware = async (req, res, next) => {
    const { token = null } = req.headers

    const verify = verifyToken(token, process.env.SECRET_JWT)

    if (!verify) {
        return res.status(401).json({
            message: 'Unauthorized'
        })
    }

    // const user = verify?.data || undefined
    // const userFind = await UsuarioRepository.findByPk(user.id_user)
    // user.correo = userFind.Correo
    req.headers.user = verify.data
    // console.log('HEADERS', req.headers)
    next()
}
