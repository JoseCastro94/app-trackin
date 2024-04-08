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

const Reportes = {
    id: 'reportes',
    title: 'Reportes',
    type: 'group',
    children: [
        {
            id: 'icons',
            title: 'Icons',
            type: 'collapse',
            icon: icons.IconWindmill,
            children: [
                {
                    id: 'entregas',
                    title: 'Entregas',
                    type: 'item',
                    url: '/reportes/entregas',
                    breadcrumbs: false
                },
                {
                    id: 'devoluciones',
                    title: 'Devoluciones',
                    type: 'item',
                    url: '/reportes/devoluciones',
                    breadcrumbs: false
                }
            ]
        }
    ]
};

export default Reportes;
