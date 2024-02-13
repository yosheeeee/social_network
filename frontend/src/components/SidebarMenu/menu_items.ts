import {SidebarMenuItemProps} from "./SidebarMenu";

let menu_items : SidebarMenuItemProps[] = [
    {
        icon_name: "fa-house",
        title: 'Главная',
        link: '/'
    },
    {
        icon_name: 'fa-bell',
        title: 'Уведомления',
        link: 'notifications'
    },
    {
        icon_name: 'fa-comment',
        title: 'Сообщения',
        link: 'messages'
    },
    {
        icon_name: 'fa-user',
        title: 'Профиль',
        link: 'auth'
    },
    {
        icon_name: 'fa-gear',
        title: "Настройки",
        link: 'settings'
    }
]

export default menu_items
