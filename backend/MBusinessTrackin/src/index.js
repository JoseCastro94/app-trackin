import 'dotenv/config'
import app from "./app.js"
import { sequelize } from "./database/database.js"






const main = async () => {
    try {
        await sequelize.sync({ force: false })
        console.log('Connection has been established successfully.')
    } catch (error) {
        console.error('Unable to connect to the database:', error)
    }
    app.listen(process.env.PORT)
    console.log(`server is listening on port ${ process.env.PORT }`)

}

main()
