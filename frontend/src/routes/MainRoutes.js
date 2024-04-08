import { lazy } from 'react';
 
// project imports
import MainLayout from '../layout/MainLayout'
import Loadable from '../ui-component/Loadable'
 
 
import { ProtectedRoute } from '../ui-component/protected/ProtectedRoute'
import { BasicProtectedRoute } from '../ui-component/protected/BasicProtectedRoute'
 
// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('../views/dashboard/Default/Home')))
 
// dashboard to buttons
const Pickingpage = Loadable(lazy(() => import('../views/dashboard/Default/PickingEntrega')))
 
 
// sample page routing
const RegisterPage = Loadable(lazy(() => import('../views/request/Register')))
const RequestRegisterAlmacen = Loadable(lazy(() => import('../views/request/RequestTransfer'))) // para poner Modulo de Solicitudes de Almacen
 
const InfoPage = Loadable(lazy(() => import('../views/request/Info')))
const DetailPage = Loadable(lazy(() => import('../views/request/Detail')))
const HistoryPage = Loadable(lazy(() => import('../views/request/History')))
 
// noinspection JSCheckFunctionSignatures
const SolicitudesPage = Loadable(lazy(() => import('../views/solicitudes')));
const SolicitudesTransferenciaPage = Loadable(lazy(() => import('../views/solicitudes/solicitudesTransferencia')));
const DespachoSolicitudTransferenciaPage = Loadable(lazy(() => import('../views/solicitudes/despachoTransferencia')));

const DespachoSolicitudPage = Loadable(lazy(() => import('../views/solicitudes/despacho')));
const EntregaSolicitudPage = Loadable(lazy(() => import('../views/solicitudes/entrega')));
 
const IngresoMercaderiaPage = Loadable(lazy(() => import('../views/ingreso-mercaderia')));
 
const RegisterIngresoMercaderiaPage = Loadable(lazy(() => import('../views/ingreso-mercaderia/register')));
const DevolucionesPage = Loadable(lazy(() => import('../views/devolucion')));
const DevolucionPage = Loadable(lazy(() => import('../views/devolucion/devolucion')));
const IncidentHomePage = Loadable(lazy(() => import('../views/incident/Home')))
const IncidentRegisterPage = Loadable(lazy(() => import('../views/incident/Register')))
const RefundRegisterPage = Loadable(lazy(() => import('../views/refund/Register')))
const RefundHistoryPage = Loadable(lazy(() => import('../views/refund/History')))
const RefundDetailPage = Loadable(lazy(() => import('../views/refund/Detail')))
const EvaluationHomePage = Loadable(lazy(() => import('../views/evaluation/Home')))
const WarehouseTransferHomePage = Loadable(lazy(() => import('../views/warehouse/transfer/Home')))
const WarehouseTransferRegisterPage = Loadable(lazy(() => import('../views/warehouse/transfer/Register')))
const RelevoPage = Loadable(lazy(() => import('../views/relevo')))
const RegistroRelevoPage = Loadable(lazy(() => import('../views/relevo/registro')))
const ArticulosPage = Loadable(lazy(() => import('../views/articulo')))
const GuideRegisterPage = Loadable(lazy(() => import('../views/guide/Register')))
const GuideHomePage = Loadable(lazy(() => import('../views/guide/Home')))
const AlmacenesPage = Loadable(lazy(() => import('../views/almacen')))
const WarehouseTakeoverHomePage = Loadable(lazy(() => import('../views/warehouse/takeover/Home')))
const WarehouseTakeoverRegisterPage = Loadable(lazy(() => import('../views/warehouse/takeover/Register')))
const EmpresasPage = Loadable(lazy(() => import('../views/empresa')))
const NegociosPage = Loadable(lazy(() => import('../views/negocio')))
const GrupoParametroPage = Loadable(lazy(() => import('../views/grupo-parametro')))
const ParametroPage = Loadable(lazy(() => import('../views/parametro')))
const UserGroupHomePage = Loadable(lazy(() => import('../views/user/group/Home')))
const GrupoArticuloPage = Loadable(lazy(() => import('../views/grupo-articulo')))
const GrupoArticuloMaestroPage = Loadable(lazy(() => import('../views/grupo-articulo-maestro')))
const UserBusinessHomePage = Loadable(lazy(() => import('../views/user/business/Home')))
const UserWarehouseHomePage = Loadable(lazy(() => import('../views/user/warehouse/Home')))
const UserCompanyHomePage = Loadable(lazy(() => import('../views/user/company/Home')))
const SecurityCompanyHomePage = Loadable(lazy(() => import('../views/security/company/Home')))
const Logout = Loadable(lazy(() => import('../views/pages/authentication/authentication3/Logout')))
const ReporteEntregaPage = Loadable(lazy(() => import('../views/reportes/entregas')))
const ReporteDevolucionPage = Loadable(lazy(() => import('../views/reportes/devoluciones')))
const ReporteStocksPage = Loadable(lazy(() => import('../views/reportes/stocks')))
const ReporteSolicitudesPage = Loadable(lazy(() => import('../views/reportes/solicitudes')))
 
// ==============================|| MAIN ROUTING ||============================== //
 
const baseURL = process.env.PUBLIC_URL
 
const MainRoutes = {
    path: `${baseURL}/`,
    element: <MainLayout />,
    children: [
        {
            path: `${baseURL}/security/logout`,
            element: <Logout />
        },
        {
            path: `${baseURL}/`,
            element: <BasicProtectedRoute>
                <DashboardDefault />
            </BasicProtectedRoute>
        },
        {
            path: `${baseURL}/request/register`,
            element: <ProtectedRoute code='/request/register'>
                <RegisterPage />
            </ProtectedRoute>
        },
        {
            path: `${baseURL}/request/info`,
            element: <ProtectedRoute code='/request/info'>
                <InfoPage />
            </ProtectedRoute>
        },
        {
            path: `${baseURL}/request/history`,
            element: <HistoryPage />
        },
        {
            path: `${baseURL}/request/detail/:IdSocilitud`,
            element: <DetailPage />
        },
        {
            path: `${baseURL}/solicitudes`,
            element: <SolicitudesPage />
        },
        {
            path: `${baseURL}/despacho/solicitudes`,
            element: <DespachoSolicitudPage />,
        },
        {
            path: `${baseURL}/despacho/solicitudesTransferencia`,
            element: <DespachoSolicitudTransferenciaPage />,
        },
        {
            path: `${baseURL}/entrega/solicitudes`,
            element: <EntregaSolicitudPage />,
        },
        {
            path: `${baseURL}/ingreso-mercaderia`,
            element: <IngresoMercaderiaPage />,
 
        },
        {
            path: `${baseURL}/ingreso-mercaderia/registrar`,
            element: <RegisterIngresoMercaderiaPage />,
 
        },
        {
            path: `${baseURL}/incident/home`,
            element: <ProtectedRoute code='/incident/home'>
                <IncidentHomePage />
            </ProtectedRoute>
        },
        {
            path: `${baseURL}/incident/register`,
            element: <IncidentRegisterPage />
        },
        {
            path: `${baseURL}/devoluciones`,
            element: <DevolucionesPage />
        },
        {
            path: `${baseURL}/devolucion`,
            element: <DevolucionPage />
        }, {
            path: `${baseURL}/refund/register`,
            element: <ProtectedRoute code='/refund/register'>
                <RefundRegisterPage />
            </ProtectedRoute>
        },
        {
            path: `${baseURL}/refund/history`,
            element: <ProtectedRoute code='/refund/history'>
                <RefundHistoryPage />
            </ProtectedRoute>
        },
        {
            path: `${baseURL}/refund/detail/:IdSocilitud`,
            element: <RefundDetailPage />
        },
        {
            path: `${baseURL}/evaluation/home`,
            element: <ProtectedRoute code='/evaluation/home'>
                <EvaluationHomePage />
            </ProtectedRoute>
        },
        {
            path: `${baseURL}/warehouse/transfer/home`,
            element: <ProtectedRoute code='/warehouse/transfer/home'>
                <WarehouseTransferHomePage />
            </ProtectedRoute>
        },
        {
            path: `${baseURL}/warehouse/transfer/register`,
            element: <WarehouseTransferRegisterPage />
        },
        {
            path: `${baseURL}/relevos`,
            element: <RelevoPage />
        },
        {
            path: `${baseURL}/relevos/registrar`,
            element: <RegistroRelevoPage />
        },
        {
            path: `${baseURL}/articulos`,
            element: <ArticulosPage />
        },
        {
            path: `${baseURL}/guide/register`,
            element: <GuideRegisterPage />
        },
        {
            path: `${baseURL}/guide/register/:IdGuia`,
            element: <GuideRegisterPage />
        },
        {
            path: `${baseURL}/guide/home`,
            element: <ProtectedRoute code='/guide/home'>
                <GuideHomePage />
            </ProtectedRoute>
        },
        {
            path: `${baseURL}/almacenes`,
            element: <AlmacenesPage />
        },
        {
            path: `${baseURL}/warehouse/takeover/home`,
            element: <ProtectedRoute code='/warehouse/takeover/home'>
                <WarehouseTakeoverHomePage />
            </ProtectedRoute>
        },
        {
            path: `${baseURL}/warehouse/takeover/register`,
            element: <WarehouseTakeoverRegisterPage />
        },
        {
            path: `${baseURL}/warehouse/takeover/register/:IdRelevoAlmacen`,
            element: <WarehouseTakeoverRegisterPage />
        },
        {
            path: `${baseURL}/empresas`,
            element: <EmpresasPage />
        },
        {
            path: `${baseURL}/negocios`,
            element: <NegociosPage />
        },
        {
            path: `${baseURL}/grupo-parametros`,
            element: <GrupoParametroPage />
        },
        {
            path: `${baseURL}/parametros`,
            element: <ParametroPage />
        },
        {
            path: `${baseURL}/user/group/home`,
            element: <ProtectedRoute code='/user/group/home'>
                <UserGroupHomePage />
            </ProtectedRoute>
        },
        {
            path: `${baseURL}/grupo-articulos`,
            element: <ProtectedRoute code='/grupo-articulos'>
                <GrupoArticuloPage />
            </ProtectedRoute>
        },
        {
            path: `${baseURL}/grupo-articulos-maestro`,
            element: <ProtectedRoute code='/grupo-articulos-maestro'>
                <GrupoArticuloMaestroPage />
            </ProtectedRoute>
        },
        {
            path: `${baseURL}/user/business/home`,
            element: <ProtectedRoute code='/user/business/home'>
                <UserBusinessHomePage />
            </ProtectedRoute>
        },
        {
            path: `${baseURL}/user/warehouse/home`,
            element: <ProtectedRoute code='/user/warehouse/home'>
                <UserWarehouseHomePage />
            </ProtectedRoute>
        },
        {
            path: `${baseURL}/user/company/home`,
            element: <UserCompanyHomePage />
        },
        {
            path: `${baseURL}/security/company/home`,
            element: <SecurityCompanyHomePage />
        },
        {
            path: '/reportes/entregas',
            element: <ReporteEntregaPage />
        },
        {
            path: '/reportes/devoluciones',
            element: <ReporteDevolucionPage />
        },
        {
            path: '/reportes/stocks',
            element: <ReporteStocksPage />
        },
        {
            path: '/reportes/solicitudes',
            element: <ReporteSolicitudesPage />
        },
        {
            path: `${baseURL}/pickingpage`,
            element: <Pickingpage />
        },
        {
            path: `${baseURL}/request/transferenciaAlmacen`,
            //  <ProtectedRoute code='/request/transferenciaAlmacen'>
            element: <RequestRegisterAlmacen />
            // </ProtectedRoute>
        },
        {
            path: `${baseURL}/solicitudesTransferencia`,
            //  <ProtectedRoute code='/request/transferenciaAlmacen'>
            element: <SolicitudesTransferenciaPage />
            // </ProtectedRoute>
        }

 
    ]
};
 
export default MainRoutes;