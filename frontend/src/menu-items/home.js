// assets
import { IconDashboard, IconDeviceAnalytics, IconHome } from '@tabler/icons'

// constant
const icons = {
    IconDashboard,
    IconDeviceAnalytics,
    IconHome
}

const baseURL = process.env.PUBLIC_URL

// ===========================|| DASHBOARD MENU ITEMS ||=========================== //

const dashboard = {
    id: 'home',
    type: 'group',
    children: [
        {
            id: 'default',
            title: 'Inicio',
            type: 'item',
            url: `${baseURL}/`,
            icon: icons.IconHome,
            breadcrumbs: false
        }
    ]
}

export default dashboard