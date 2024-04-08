import { DetalleTransladoAlmacen } from '../models/DetalleTransladoAlmacen.js'

export const getList = async (req, res) => {
    try {
        const {
            IdTranslado
        } = req.params

        const detalle = await DetalleTransladoAlmacen.findAll({
            attributes: [
                ["IdDetalleTranslado", "id"],
                "FechaTranslado",
                "FechaRecepcion",
                "ItemCode",
                "ItemName",
                "Grupo",
                "U_BPP_TIPUNMED",
                "CodeBars",
                "CantidadEnviada",
                "CantidadRecibida",
                "SerialNumber",
            ],
            where: {
                IdTranslado
            }
        })
        res.json(detalle)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}