import { Parametro } from '../models/Parametro.js'

export const getParametroByGrupo = async (req, res) => {
    try {
        const {
            IdGrupo,
        } = req.params

        const {
            Valor1,
        } = req.body

        let where = {
            IdGrupo,
            Activo: true,
        }

        if (Valor1) {
            where.Valor1 = Valor1
        }

        const parametros = await Parametro.findAll({
            where,
            attributes: [
                "IdParametro",
                "Nombre",
                "Descripcion",
            ],
            order: [["Nombre", 'ASC']],
        })
        res.json(parametros)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}