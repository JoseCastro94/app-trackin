import jwt from 'jsonwebtoken'

export const empresaMiddleware = (req, res, next) => {
    const { empresa = null } = req.headers
    const company = jwt.decode(empresa)?.data.empresa || undefined
    req.headers = {...req.headers, company}
    next()
}
