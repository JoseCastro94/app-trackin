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
app.use(express.json())

// Middlewares
app.use(morgan("dev"))

app.use(empresaMiddleware)

import labRoutes from './routes/lab.routes.js'
import reportes from './routes/reportes.routes.js'
import exportData from './routes/export.excel.routes.js'
import { empresaMiddleware } from "./middlewares/empresaMiddleware.js";

////verify
import reportingRoutes from './routes/reporting.routes.js'

// Routes
app.use("/reporting/api/lab", labRoutes)
app.use("/reporting/api", reportes)
app.use("/reporting/api/export-excel", exportData)

app.use("/reporting", reportingRoutes)

export default app
