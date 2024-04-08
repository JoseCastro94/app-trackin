import {
    IconDashboard, IconSitemap, IconUserCheck, IconSettings, IconRefresh, IconShieldLock,
    IconDoorExit, IconFileInvoice, IconUser, IconReport, IconFileLike, IconFilePencil,
    IconListCheck, IconFileCertificate, IconCalendarEvent, IconUsers, IconCertificate,
    IconChartDots, IconHome, IconListDetails,IconQuestionMark,IconClipboardList, IconPackgeImport,
    IconFileHorizontal,IconCategory, IconFileDownload, IconPackage, IconTool

    
} from '@tabler/icons'

import { IconNews, IconReportSearch, IconBox, IconListSearch } from '@tabler/icons';

// constant
const icons = {
    IconDashboard,
    IconSitemap,
    IconUserCheck,
    IconSettings,
    IconRefresh,
    IconShieldLock,
    IconDoorExit,
    IconFileInvoice,
    IconUser,
    IconReport,
    IconFileLike,
    IconFilePencil,
    IconListCheck,
    IconFileCertificate,
    IconCalendarEvent,
    IconUsers,
    IconCertificate,
    IconChartDots,
    IconHome,
    IconListDetails,
    IconQuestionMark,
    IconNews,
    IconReportSearch,
    IconBox,
    IconListSearch,
    IconClipboardList,
    IconPackgeImport,
    IconFileHorizontal,
    IconCategory,
    IconFileDownload,
    IconPackage,
    IconTool
}

const baseURL = process.env.PUBLIC_URL

const list = (data) => {
    data.id = data.id_option
    data.title = data.title.charAt(0).toUpperCase() + data.title.slice(1).toLowerCase()


    if (data.icon !== null) {
        data.icon = icons[data.icon]
    }

    data.children.forEach(children_1 => {
        children_1.id = children_1.id_option
        if (children_1.url !== null) {
            children_1.url = `${baseURL}${children_1.url}`
        }
        if (children_1.icon !== null) {
            children_1.icon = icons[children_1.icon]
        }

        children_1.children.forEach(children_2 => {
            children_2.id = children_2.id_option
            if (children_2.url !== null) {
                children_2.url = `${baseURL}${children_2.url}`
            }
            if (children_2.icon !== null) {
                children_2.icon = icons[children_2.icon]
            }
        })
    })
    return data
}

export default list