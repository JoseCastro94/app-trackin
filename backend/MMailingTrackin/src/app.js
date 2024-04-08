import bodyParser from 'body-parser'
import express from 'express'
import morgan from "morgan"
import cors from 'cors'
import helmet from 'helmet'

const app = express()

app.use((req, res, next) => {
    const cacheTime = 300 //60*60*24; // 60 segundos * 60 minutos * 24 horas = 1 día
    res.set({
      'Cache-Control': `max-age=${cacheTime}`
    });
    next();
  });
app.use(helmet())
app.use(cors())
app.disable('x-powered-by')
//app.use(express.json())

// Middlewares
app.use(morgan("dev"))
app.use(bodyParser.json({
    limit: '50mb'
}))
app.use(bodyParser.urlencoded({
    limit: '50mb',
    parameterLimit: 100000,
    extended: true
}))

app.use(empresaMiddleware)

import routes from './routes/index.js'
import { empresaMiddleware } from "./middlewares/empresaMiddleware.js";

////verify
import mailingRoutes from './routes/mailing.routes.js'

app.use("/mailing/api", routes)

app.use("/mailing", mailingRoutes)

export default app
