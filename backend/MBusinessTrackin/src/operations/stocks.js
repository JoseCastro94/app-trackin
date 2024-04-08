import { TransacAlmacen } from '../models/TransacAlmacen.js'
import { Stock } from '../models/Stock.js'
import { ControlSerie } from '../models/ControlSerie.js'

export const ProcesarStock = ({
    IdTipoTransac,
    Cantidad,
    Tipo,
    UsuarioCreacion,
    IdUsuario,
    IdEmpresa,
    IdAlmacenOrigen,
    IdDetalleSolicitud,
    IdNegocio,
    IdArticulo,
    ItemCode,
    ItemName,
    Devolucion,
    Grupo,
    transaction,
    IdDetalleDespacho = null,
    TipoStock = 'DISPONIBLE',
    IdIncidente,
    Evaluacion,
    TransferStock,
}) => {
    let exec = async () => {
        await TransacAlmacen.create({
            IdTipoTransac,
            Cantidad,
            Tipo,
            UsuarioCreacion,
            IdUsuario,
            IdEmpresa,
            IdAlmacenOrigen,
            IdDetalleSolicitud,
            IdNegocio,
            IdArticulo,
            ItemCode,
            ItemName,
            U_Devolicion: Devolucion,
            Nombre_GrupArt: Grupo,
            IdDetalleDespacho,
            IdIncidente
        }, { transaction })

        const exists = await Stock.findOne({
            where: {
                IdAlmacen: IdAlmacenOrigen,
                IdNegocio,
                IdArticulo,
                Tipo: TipoStock,
            }
        })

        if (!exists) {
            await Stock.create({
                Cantidad: 0,
                IdAlmacen: IdAlmacenOrigen,
                IdNegocio,
                IdArticulo,
                Tipo: TipoStock,
            })
        }

        switch (IdTipoTransac) {
            case 'SOL':
                if (TransferStock) {
                    await AddStock(IdAlmacenOrigen, IdNegocio, IdArticulo, TransferStock, -Cantidad)
                }
                await Stock.increment({
                    Cantidad: Cantidad
                }, {
                    transaction,
                    where: {
                        IdAlmacen: IdAlmacenOrigen,
                        IdNegocio,
                        IdArticulo,
                        Tipo: TipoStock,
                    }
                })
                break
            case 'DEL':
                if (TransferStock) {
                    await AddStock(IdAlmacenOrigen, IdNegocio, IdArticulo, TransferStock, -Cantidad)
                }
                await Stock.increment({
                    Cantidad: Cantidad
                }, {
                    transaction,
                    where: {
                        IdAlmacen: IdAlmacenOrigen,
                        IdNegocio,
                        IdArticulo,
                        Tipo: TipoStock,
                    }
                })
                break
            case 'INC':
                await Stock.increment({
                    Cantidad: Cantidad
                }, {
                    transaction,
                    where: {
                        IdAlmacen: IdAlmacenOrigen,
                        IdNegocio,
                        IdArticulo,
                        Tipo: TipoStock,
                    }
                })
                break
            case 'DEV':
                if (!Evaluacion) {
                    await Stock.increment({
                        Cantidad: Cantidad
                    }, {
                        transaction,
                        where: {
                            IdAlmacen: IdAlmacenOrigen,
                            IdNegocio,
                            IdArticulo,
                            Tipo: TipoStock,
                        }
                    })
                } else {
                    await AddStock(IdAlmacenOrigen, IdNegocio, IdArticulo, TransferStock, Cantidad, transaction)
                }

                await Stock.decrement({
                    Cantidad: Cantidad
                }, {
                    transaction,
                    where: {
                        IdAlmacen: IdAlmacenOrigen,
                        IdNegocio,
                        IdArticulo,
                        Tipo: 'ASIGNADO',
                    }
                })
                break
            case 'ING':
                await Stock.increment({
                    Cantidad: Cantidad
                }, {
                    transaction,
                    where: {
                        IdAlmacen: IdAlmacenOrigen,
                        IdNegocio,
                        IdArticulo,
                        Tipo: TipoStock,
                    }
                })
                break
            case 'ENTREGA':
                if (TransferStock) {
                    await AddStock(IdAlmacenOrigen, IdNegocio, IdArticulo, TransferStock, (Cantidad * -1), transaction)
                }
                await Stock.increment({
                    Cantidad: Cantidad
                }, {
                    transaction,
                    where: {
                        IdAlmacen: IdAlmacenOrigen,
                        IdNegocio,
                        IdArticulo,
                        Tipo: TipoStock,
                    }
                })
                break
            case 'REING':
                if (TransferStock) {
                    await AddStock(IdAlmacenOrigen, IdNegocio, IdArticulo, TransferStock, Cantidad)
                }
                await Stock.increment({
                    Cantidad: -Cantidad
                }, {
                    transaction,
                    where: {
                        IdAlmacen: IdAlmacenOrigen,
                        IdNegocio,
                        IdArticulo,
                        Tipo: TipoStock,
                    }
                })
                break
        }
    }
    return new Promise((resolve, reject) => {
        exec().then(() => {
            resolve(true)
        })
    })
}

export const TransladoSerie = async (IdControlSerie, State, TypeTo, id_user) => {
    const control_serie = await ControlSerie.findByPk(IdControlSerie)
    if (control_serie) {
        await AddStock(
            control_serie.IdAlmacen,
            control_serie.IdNegocio,
            control_serie.IdArticulo,
            TypeTo,
            1
        )
        control_serie.IdEstado = State
        control_serie.UsuarioModifica = id_user
        control_serie.FechaModifica = new Date()
        await control_serie.save()
    }
}

export const AddStock = async (IdAlmacen, IdNegocio, IdArticulo, Tipo, Cantidad, transaction) => {
    const stock_to = await Stock.findOne({
        where: {
            IdAlmacen,
            IdNegocio,
            IdArticulo,
            Tipo
        },
        transaction
    })
    if (!stock_to) {
        await Stock.create({
            Cantidad,
            IdAlmacen,
            IdNegocio,
            IdArticulo,
            Tipo,
        }, {transaction})
    } else {
        stock_to.Cantidad = stock_to.Cantidad + Cantidad
        await stock_to.save({transaction})
    }
}

export const TransferStock = async (Tipo, IdAlmacenOrigen, IdAlmacenDestino, IdNegocio, IdArticulo, Cantidad) => {
    await Stock.decrement({
        Cantidad: Cantidad
    }, {
        where: {
            Tipo,
            IdAlmacen: IdAlmacenOrigen,
            IdNegocio,
            IdArticulo,
        }
    })

    const findStockDestino = await Stock.findOne({
        where: {
            Tipo,
            IdAlmacen: IdAlmacenDestino,
            IdNegocio,
            IdArticulo,
        }
    })
    if (!findStockDestino) {
        await Stock.create({
            Cantidad: Cantidad,
            IdAlmacen: IdAlmacenDestino,
            IdNegocio,
            IdArticulo,
            Tipo,
        })
    } else {
        findStockDestino.Cantidad = findStockDestino.Cantidad + Cantidad
        await findStockDestino.save()
    }
}

export const TransladoControlSerie = async (SerialNumber, IdArticulo, IdAlmacen) => {
    await ControlSerie.update({
        IdAlmacen: IdAlmacen
    }, {
        where: {
            SerialNumber: SerialNumber,
            IdArticulo: IdArticulo
        }
    })
}
