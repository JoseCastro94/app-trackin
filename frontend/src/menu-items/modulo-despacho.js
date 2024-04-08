// assets
import { IconTypography, IconPalette, IconShadow, IconWindmill } from '@tabler/icons';

// constant
const icons = {
    IconTypography,
    IconPalette,
    IconShadow,
    IconWindmill
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const Modules = {
    id: 'modules',
    title: 'Modulos',
    type: 'group',
    children: [
        {
            id: 'icons',
            title: 'Icons',
            type: 'collapse',
            icon: icons.IconWindmill,
            children: [
                {
                    id: 'solicitudes',
                    title: 'Solicitudes',
                    type: 'item',
                    url: '/solicitudes',
                    breadcrumbs: false
                }/*,
                {
                    id: 'tabler-icons',
                    title: 'Despacho',
                    type: 'item',
                    url: '/despacho/solicitudes',
                    breadcrumbs: false
                }*/,
                {
                    id: 'entrega-solicitudes',
                    title: 'Entrega',
                    type: 'item',
                    url: '/entrega/solicitudes',
                    breadcrumbs: false
                },
                {
                    id: 'ingreso-mercaderia',
                    title: 'Ingreso Mercaderia',
                    type: 'item',
                    url: '/ingreso-mercaderia',
                    breadcrumbs: false
                },
                {
                    id: 'devoluciones',
                    title: 'Devoluciones',
                    type: 'item',
                    url: '/devoluciones',
                    breadcrumbs: false
                },
                {
                    id: 'list-relevos',
                    title: 'Listar Relevos',
                    type: 'item',
                    url: '/relevos',
                    breadcrumbs: false
                },
                {
                    id: 'list-articulos',
                    title: 'Listar Articulos',
                    type: 'item',
                    url: '/articulos',
                    breadcrumbs: false
                }
            ]
        }
    ]
};

export default Modules;
