import { GuiaRemision } from '../models/GuiaRemision.js'
import { Ubigeo } from '../models/Ubigeo.js'

export const getDepartamento = async (req, res) => {
    try {
        let newUbigeo = await Ubigeo.findAll({
            attributes: [
                "departamento_inei",
                "departamento"
            ],
            group: 'departamento_inei',
            order: [
                ['departamento', 'ASC']
            ]
        })
        return res.json(newUbigeo)
    } catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
}

export const getProvincia = async (req, res) => {
    try {
        const {
            departamento_inei
        } = req.body

        let newUbigeo = await Ubigeo.findAll({
            where: {
                departamento_inei
            },
            attributes: [
                "provincia_inei",
                "provincia"
            ],
            group: 'provincia_inei',
            order: [
                ['provincia', 'ASC']
            ]
        })
        return res.json(newUbigeo)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message,
        })
    }
}

export const getDistrito = async (req, res) => {
    try {
        const {
            provincia_inei
        } = req.body

        let newUbigeo = await Ubigeo.findAll({
            where: {
                provincia_inei
            },
            attributes: [
                "ubigeo_inei",
                "distrito"
            ],
            group: 'ubigeo_inei',
            order: [
                ['distrito', 'ASC']
            ]
        })
        return res.json(newUbigeo)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message,
        })
    }
}

export const getUbigeo = async (req, res) => {
    try {
        const {
            ubigeo_inei
        } = req.body

        let newUbigeo = await Ubigeo.findOne({
            where: {
                ubigeo_inei
            },
            attributes: [
                "departamento_inei",
                "provincia_inei",
                "ubigeo_inei",
            ],
        })
        return res.json(newUbigeo)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message,
        })
    }
}