import jwt from 'jsonwebtoken'

export const empresaMiddleware = (req, res, next) => {
    const { empresa = null } = req.headers

    try {
        const verify = jwt.verify(empresa, process.env.SECRET_APP_JWT)

        const company = verify.data.empresa
        const usuario = verify.data.usuario
        req.headers.company = company
        req.headers.user.correo = usuario.Correo
        //console.log('HEADERS', req.headers)
        next()
    } catch {
        return res.status(401).json({ message: "Unauthorized!" })
    }
}
