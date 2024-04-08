
import { Sequelize } from 'sequelize'


export const sequelize = new Sequelize(

process.env.DB_NAME,

process.env.BD_USER,

process.env.DB_PASSWORD,

 {
host: process.env.DB_SERVER,

dialect: process.env.DB_DIALECT || 'mariadb',

connectTimeout: 8000,

dialectOptions: {

useUTC: false, //for reading from database

dateStrings: true,

typeCast: true

},

timezone: 'America/Bogota' //for writing to database

}, 

)
 