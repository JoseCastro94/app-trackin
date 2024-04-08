import {pool} from "../database/database.js";

class SolicitudController {
    static listar = async (req, res) => {
        const {company} = req.headers
        console.log('company.id', company.id)
        let conn;
        const { solicitante, dniSolicitante, fecha_ini, fecha_fin, estado, codigo, page, rows, limit } = req.body
        try {
            conn = await pool.getConnection()
            let data = await conn.query(`CALL SP_SOLICITUDES(?,?,?,?,?,?,?,?,?,?,@total);`,
                [rows, page, limit, fecha_ini, fecha_fin, solicitante, dniSolicitante, estado, codigo, company.id])
            const response = await conn.query('SELECT @total as count')
            const arrayPromises = data[0].map(item => conn.query('CALL SP_DETALLE_SOLICITUD(?)', [item.id]))
            const detalle = await Promise.all(arrayPromises)
            data = data[0].map((item, index) => {
                item.detalle = detalle[index][0]
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
        console.log('company.id', company.id)
        let conn;
        const { solicitante, dniSolicitante, fecha_ini, fecha_fin, estado, codigo } = req.body
        try {
            conn = await pool.getConnection()
            let data = await conn.query(`CALL SP_EXPORTAR_EXCEL_SOLICITUDES(?,?,?,?,?,?,?);`,
                [fecha_ini, fecha_fin, solicitante, dniSolicitante, estado, codigo, company.id])
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

export default SolicitudController
