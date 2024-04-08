import { pool } from '../database/database.js'

export const lab = async (req, res) => {
    let conn;

    try {
        conn = await pool.getConnection()
        const rows = await conn.query("SELECT 1 as val")
        return res.json(rows)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message,
        })
    } finally {
        if (conn) conn.release()
    }
}