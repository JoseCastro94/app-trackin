import { Stock } from '../models/Stock.js'
import { v4 as uuidv4 } from 'uuid'
import { ESTADO_DETALLE_SOLICITUD } from '../storage/const.js'

export const ProcesarDetalle = ({
    id,
    IdAlmacen,
    IdNegocio,
    IdArticulo,
    Cantidad,
    IdEstado,
    ...others
}) => {
    let exec = async () => {
        let detail = []
        const stock = await Stock.findOne({
            where: {
                IdAlmacen,
                IdNegocio,
                IdArticulo,
            }
        })
        if (Cantidad > stock.Cantidad) {
            //let split = parseInt(Cantidad - stock.Cantidad)
            // if (stock.Cantidad > 0) {
            //     detail.push({
            //         id: uuidv4(),
            //         IdAlmacen,
            //         IdNegocio,
            //         IdArticulo,
            //         Cantidad: stock.Cantidad,
            //         IdEstado: '95cf2544-a507-4ff1-b7b1-174a1e158dd0',
            //         ...others
            //     })
            // }
            detail.push({
                id: uuidv4(),
                IdAlmacen,
                IdNegocio,
                IdArticulo,
                Cantidad: Cantidad,
                IdEstado: ESTADO_DETALLE_SOLICITUD.PENDIENTE,
                ...others
            })
        } else {
            detail.push({
                id: uuidv4(),
                IdAlmacen,
                IdNegocio,
                IdArticulo,
                Cantidad,
                IdEstado: ESTADO_DETALLE_SOLICITUD.PENDIENTE,
                ...others
            })
        }
        return detail
    }
    return new Promise((resolve, reject) => {
        exec().then((details) => {
            resolve(details)
        })
    })
}