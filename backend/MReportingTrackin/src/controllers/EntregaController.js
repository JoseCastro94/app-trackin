import {pool} from "../database/database.js";

class EntregaController {
    static listar = async (req, res) => {
        const {company} = req.headers
        console.log('company', company)
        let conn;
        const { fecha_ini, fecha_fin, almacen, responsables, negocios,
            estado, asignada, dni_asignada, codigo, page, rows, limit } = req.body

        try {
            conn = await pool.getConnection()
            let data = await conn.query(`CALL SP_ENTREGAS(?,?,?,?,?,?,?,?,?,?,?,?,?,@total);`,
                [rows, page, limit, fecha_ini, fecha_fin, estado, company.id, almacen.toString(), codigo, asignada,
                    dni_asignada, responsables.toString(), negocios.toString()])
            console.log('DATA', data)
            const response = await conn.query('SELECT @total as count')
            const idsEntregas = data[0].map(item => item.id)
            const detalles = await conn.query('CALL SP_DETALLE_ENTREGA(?)', idsEntregas.toString())
            console.log('DETALLE', detalles)
            data = data[0].map((item, index) => {
                item.detalle = detalles[0].filter(detalle => detalle.IdDespacho === item.id)
                return item
            })

            response[0].rows = data

            return res.json(response[0])
        } catch (error) {
            console.log(error)
            res.status(500).json({
                message: error.message,
            })
        } finally {
            if (conn) conn.release()
        }
    }

    static exportExcel = async (req, res) => {
        const {company} = req.headers
        let conn;
        const { fecha_ini, fecha_fin, almacen, responsables, negocios,
            estado, asignada, dni_asignada, codigo, page, rows, limit } = req.body

        try {
            conn = await pool.getConnection()
            let data = await conn.query(`CALL SP_EXPORTAR_EXCEL_ENTREGAS(?,?,?,?,?,?,?,?,?,?);`,
                [fecha_ini, fecha_fin, estado, company.id, almacen.toString(), codigo, asignada,
                    dni_asignada, responsables.toString(), negocios.toString()])

            return res.json(data[0])
        } catch (error) {
            console.log(error)
            res.status(500).json({
                message: error.message,
            })
        } finally {
            if (conn) conn.release()
        }
    }
}

export default EntregaController
