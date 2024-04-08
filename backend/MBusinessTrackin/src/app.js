import express from 'express'
import morgan from "morgan"
import cors from 'cors'
import bodyParser from 'body-parser'
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

// Import routes
import usuarioRoutes from "./routes/usuario.routes.js"
import almacenRoutes from "./routes/almacen.routes.js"
import almacenesRoutes from "./routes/almacenes.routes.js"
import usuarioalmacenRoutes from "./routes/usuario_almacen.routes.js"
import empresaparametroRoutes from "./routes/empresa_parametro.routes.js"
import articuloRoutes from "./routes/articulo.routes.js"
import articulosRoutes from "./routes/articulos.routes.js"
import grupo_articuloRoutes from "./routes/grupo_articulo.routes.js"
import articulo_negocioRoutes from "./routes/articulo_negocio.routes.js"
import usuario_negocioRoutes from "./routes/usuario_negocio.routes.js"
import tipo_negocioRoutes from "./routes/tipo_negocio.routes.js"
import solicitud_articuloRoutes from "./routes/solicitud_articulo.routes.js"
import detalle_solicitud_articuloRoutes from "./routes/detalle_solicitud_articulo.routes.js"
import grupo_trabajadorRoutes from "./routes/grupo_trabajador.routes.js"
import incidente_adjuntoRoutes from "./routes/incidente_adjunto.routes.js"
import despachoSolicitudRoute from "./routes/despacho.solicitud.route.js";
import solicitudArticuloRoute from "./routes/solicitud.articulo.router.js";
import solicitudTransferenciaRoute from "./routes/solicitud.transferencia.router.js";
import entregaRouter from "./routes/entrega.routes.js";
import pdf from "./routes/generate.pdf.js";
import incidenciasRoutes from "./routes/incidencias.routes.js"
import parametroRoutes from "./routes/parametro.routes.js"
import grupoParametroRoutes from "./routes/grupo.parametro.routes.js"
import movimientoMercanciaRoutes from "./routes/movimiento.mercancia.router.js"
import devolucionRouter from "./routes/devolucion.router.js";
import detalle_despachoRoutes from "./routes/detalle_despacho.routes.js"
import evaluacion_adjuntoRoutes from "./routes/evaluacion_adjunto.routes.js"
import evaluacion_articuloRoutes from "./routes/evaluacion_articulo.routes.js"
import controlSeriesRoutes from "./routes/control.series.routes.js"
import stockRoutes from "./routes/stock.routes.js"
import historialResponsableAlmacenRoutes from "./routes/historial.responsable.almacen.routes.js"
import translado_almacenRoutes from "./routes/translado_almacen.routes.js"
import detalle_translado_almacenRoutes from "./routes/detalle_translado_almacen.routes.js"
import transferencia_adjuntosRoutes from "./routes/transferencia_adjuntos.routes.js"
import grupoArticuloRoutes from "./routes/grupo.articulo.routes.js"
import tipoNegocioRoutes from "./routes/tipo.negocio.routes.js"
import articuloExternoRoutes from "./routes/articulo.externo.routes.js"
import empresaRoutes from "./routes/empresa.routes.js"
import empresaImportDataRoutes from "./routes/empresa-import-data.routes.js"
import guia_remisionRoutes from "./routes/guia_remision.routes.js"
import ubigeoRoutes from "./routes/ubigeo.routes.js"
import archivoAdjuntoRoutes from "./routes/archivo.adjunto.routes.js"
import relevo_almacenReoutes from './routes/relevo_almacen.routes.js'
import relevo_adjuntoReoutes from './routes/relevo_adjunto.routes.js'
import authRoutes from './routes/auth.routes.js'
import usuario_empresaRoutes from './routes/usuario_empresa.routes.js'
import usuarioAlmacenRoutes from './routes/usuario.almacen.routes.js'
import processRoutes from './routes/process.routes.js'
import grupo_articulo_maestroRoutes from './routes/grupo_articulo_maestro.routes.js'
import grupoArticuloMaestroRoutes from "./routes/grupo.articulo.maestro.routes.js"

////verify
import businessRoutes from './routes/business.routes.js'


// Middlewares
app.use(morgan("dev"))
//app.use(express.json())
app.use(bodyParser.json({
    limit: '50mb'
}))
app.use(bodyParser.urlencoded({
    limit: '50mb',
    parameterLimit: 100000,
    extended: true
}))
app.use(express.static('public'))

import { usuarioMiddleware } from './middlewares/usuarioMiddleware.js'
import { empresaMiddleware } from './middlewares/empresaMiddleware.js'

let prefix = '/business' // /business

// Routes
app.use(prefix + "/api/usuario", usuarioMiddleware, usuarioRoutes)
app.use(prefix + "/api/almacen", usuarioMiddleware, empresaMiddleware, almacenRoutes)
app.use(prefix + "/api/almacenes", usuarioMiddleware, empresaMiddleware, almacenesRoutes)
app.use(prefix + "/api/usuarioalmacen", usuarioMiddleware, empresaMiddleware, usuarioalmacenRoutes)
app.use(prefix + "/api/usuario-almacen", usuarioMiddleware, empresaMiddleware, usuarioAlmacenRoutes)
app.use(prefix + "/api/empresaparametro", usuarioMiddleware, empresaMiddleware, empresaparametroRoutes)
app.use(prefix + "/api/empresas", usuarioMiddleware, empresaRoutes)
app.use(prefix + "/api/empresa/import-data", usuarioMiddleware, empresaMiddleware, empresaImportDataRoutes)
app.use(prefix + "/api/articulo", usuarioMiddleware, empresaMiddleware, articuloRoutes)
app.use(prefix + "/api/articulos", usuarioMiddleware, empresaMiddleware, articulosRoutes)
app.use(prefix + "/api/grupo_articulo", usuarioMiddleware, empresaMiddleware, grupo_articuloRoutes)
app.use(prefix + "/api/grupo-articulo", usuarioMiddleware, empresaMiddleware, grupoArticuloRoutes)
app.use(prefix + "/api/articulo_negocio", usuarioMiddleware, empresaMiddleware, articulo_negocioRoutes)
app.use(prefix + "/api/usuario_negocio", usuarioMiddleware, empresaMiddleware, usuario_negocioRoutes)
app.use(prefix + "/api/tipo_negocio", usuarioMiddleware, empresaMiddleware, tipo_negocioRoutes)
app.use(prefix + "/api/negocios", usuarioMiddleware, empresaMiddleware, tipoNegocioRoutes)
app.use(prefix + "/api/solicitud_articulo", usuarioMiddleware, empresaMiddleware, solicitud_articuloRoutes)
app.use(prefix + "/api/detalle_solicitud_articulo", usuarioMiddleware, empresaMiddleware, detalle_solicitud_articuloRoutes)
app.use(prefix + "/api/grupo_trabajador", usuarioMiddleware, empresaMiddleware, grupo_trabajadorRoutes)
app.use(prefix + "/api/incidencias", usuarioMiddleware, empresaMiddleware, incidenciasRoutes)
app.use(prefix + "/api/parametro", usuarioMiddleware, empresaMiddleware, parametroRoutes)
app.use(prefix + "/api/grupo-parametro", usuarioMiddleware, empresaMiddleware, grupoParametroRoutes)
app.use(prefix + "/api/incidente_adjunto", usuarioMiddleware, empresaMiddleware, incidente_adjuntoRoutes)
app.use(prefix + "/api/solicitudes", usuarioMiddleware, empresaMiddleware, solicitudArticuloRoute)
app.use(prefix + "/api/solicitudesTransferencia", usuarioMiddleware, empresaMiddleware, solicitudTransferenciaRoute)
app.use(prefix + "/api/despachos", usuarioMiddleware, empresaMiddleware, despachoSolicitudRoute)
app.use(prefix + "/api/pdf/generate", usuarioMiddleware, empresaMiddleware, pdf)
app.use(prefix + "/api/entrega", usuarioMiddleware, empresaMiddleware, entregaRouter)
app.use(prefix + "/api/devolucion", usuarioMiddleware, empresaMiddleware, devolucionRouter)
// app.use(prefix +  "/api/parametro",  usuarioMiddleware, empresaMiddleware,  parametroRoutes)
app.use(prefix + "/api/ingreso-mercancia", usuarioMiddleware, empresaMiddleware, movimientoMercanciaRoutes)
app.use(prefix + "/api/detalle_despacho", usuarioMiddleware, empresaMiddleware, detalle_despachoRoutes)
app.use(prefix + "/api/evaluacion_adjunto", usuarioMiddleware, empresaMiddleware, evaluacion_adjuntoRoutes)
app.use(prefix + "/api/evaluacion_articulo", usuarioMiddleware, empresaMiddleware, evaluacion_articuloRoutes)
app.use(prefix + "/api/control-series", usuarioMiddleware, empresaMiddleware, controlSeriesRoutes)
app.use(prefix + "/api/control_series", usuarioMiddleware, empresaMiddleware, controlSeriesRoutes)
app.use(prefix + "/api/stocks", usuarioMiddleware, empresaMiddleware, stockRoutes)
app.use(prefix + "/api/historial-responsable-almacen", usuarioMiddleware, empresaMiddleware, historialResponsableAlmacenRoutes)
app.use(prefix + "/api/translado_almacen", usuarioMiddleware, empresaMiddleware, translado_almacenRoutes)
app.use(prefix + "/api/detalle_translado_almacen", usuarioMiddleware, empresaMiddleware, detalle_translado_almacenRoutes)
app.use(prefix + "/api/transferencia_adjuntos", usuarioMiddleware, empresaMiddleware, transferencia_adjuntosRoutes)
app.use(prefix + "/api/guia_remision", usuarioMiddleware, empresaMiddleware, guia_remisionRoutes)
app.use(prefix + "/api/ubigeo", usuarioMiddleware, empresaMiddleware, ubigeoRoutes)
app.use(prefix + "/api/upload-files", usuarioMiddleware, empresaMiddleware, archivoAdjuntoRoutes)
app.use(prefix + "/api/relevo_almacen", usuarioMiddleware, empresaMiddleware, relevo_almacenReoutes)
app.use(prefix + "/api/relevo_adjunto", usuarioMiddleware, empresaMiddleware, relevo_adjuntoReoutes)
app.use(prefix + "/api/auth", usuarioMiddleware, authRoutes)
app.use(prefix + "/api/usuario_empresa", usuarioMiddleware, empresaMiddleware, usuario_empresaRoutes)
app.use("/api-external/articulo", usuarioMiddleware, empresaMiddleware, articuloExternoRoutes)
app.use(prefix + "/api/process", usuarioMiddleware, empresaMiddleware, processRoutes)
app.use(prefix + "/api/grupo_articulo_maestro", usuarioMiddleware, empresaMiddleware, grupo_articulo_maestroRoutes)
app.use(prefix + "/api/grupo-articulo-maestro", usuarioMiddleware, empresaMiddleware, grupoArticuloMaestroRoutes)

app.use(prefix + "/business", businessRoutes)

export default app
