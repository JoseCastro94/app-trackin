import {pool} from "../database/database.js";

class StockController {
    static listar = async (req, res) => {
        const {company} = req.headers
        let conn;
        const { almacen, grupo, responsables, negocios, estado, page, rows, limit, articulo } = req.body

        console.log('demo', { almacen, grupo, responsables, negocios, estado, page, rows, limit, articulo })

        try {
            conn = await pool.getConnection()
            let data = await conn.query(`CALL SP_STOCKS(?,?,?,?,?,?,?,?,?,?,@total);`,
                [rows, page, limit, company.id, estado, grupo, almacen, responsables.toString(), negocios.toString(), articulo])
            const response = await conn.query('SELECT @total as count')

            response[0].rows = data[0]
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
        const { almacen, grupo, responsables, negocios, estado, articulo } = req.body

        try {
            conn = await pool.getConnection()
            let data = await conn.query(`CALL SP_EXPORTAR_EXCEL_STOCKS(?,?,?,?,?,?,?);`,
                [company.id, estado, grupo, almacen, responsables.toString(), negocios.toString(), articulo])
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

export default StockController
