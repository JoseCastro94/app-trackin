import mariadb from 'mariadb'

export const pool = mariadb.createPool({
    host: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    user: process.env.BD_USER,
    password: process.env.DB_PASSWORD,
    connectionLimit: 10
})