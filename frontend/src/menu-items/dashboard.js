// assets
import { IconDashboard, IconNews, IconReportSearch, IconBox, IconListSearch } from '@tabler/icons';

// constant
const icons = { IconDashboard, IconNews, IconReportSearch, IconBox, IconListSearch };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
    id: 'dashboard',
    title: 'Inicio',
    type: 'group',
    children: [
        {
            id: 'default',
            title: 'Solicitudes',
            type: 'item',
            url: '/incident/home',
            icon: icons.IconReportSearch,
            breadcrumbs: false
        },
        {
            id: 'incident_home',
            title: 'Incidentes',
            type: 'item',
            url: '/incident/home',
            icon: icons.IconReportSearch,
            breadcrumbs: false
        },
        {
            id: 'refund_register',
            title: 'Devolución',
            type: 'item',
            url: '/refund/history',
            icon: icons.IconBox,
            breadcrumbs: false
        },
        {
            id: 'evaluation_register',
            title: 'Evaluación',
            type: 'item',
            url: '/evaluation/home',
            icon: icons.IconListSearch,
            breadcrumbs: false
        },
        {
            id: 'warehouse_transfer',
            title: 'Transferencia',
            type: 'item',
            url: '/warehouse/transfer/home',
            icon: icons.IconListSearch,
            breadcrumbs: false
        },
        {
            id: 'guide_home',
            title: 'Guia de Remisión',
            type: 'item',
            url: '/guide/home',
            icon: icons.IconListSearch,
            breadcrumbs: false
        }
    ]
};

export default dashboard;
