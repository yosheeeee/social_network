import {useTypeSelector} from "./useTypeSelector";
import {SidebarMenuItemProps} from "../components/SidebarMenu/SidebarMenu";
import {UserState} from "../store/reducers/userReducer/types";
import {useEffect, useState} from "react";

export default function useNavLinks(user: UserState) {
    let [menu_items, set_menu_items] = useState<SidebarMenuItemProps[]>([
        {
            icon_name: "fa-house",
            title: 'Главная',
            link: '/',
            isDisabled: false,
        },
        {
            icon_name: 'fa-bell',
            title: 'Уведомления',
            link: 'notifications',
            isDisabled: true,
        },
        {
            icon_name: 'fa-user',
            title: 'Профиль',
            link: user.isLoggedIn ? 'user/' + user.id : 'auth',
            isDisabled: false
        },
        {
            icon_name: "fa-gear",
            title: "Настройки",
            link: "settings",
            isDisabled: false
        }
    ])

    useEffect(() => {
        if (user.isLoggedIn) {
            set_menu_items(prevState => {
                prevState[2].link = 'user/' + user.id
                prevState[2].title = "Профиль"
                prevState[1].isDisabled = false
                prevState[3].isDisabled = false
                return prevState
            })
        } else {
            set_menu_items(prevState => {
                prevState[2].link = 'auth'
                prevState[2].title = 'Вход'
                prevState[1].isDisabled = true
                prevState[3].isDisabled = true
                return prevState
            })

        }
    }, [user]);

    return {menu_items, set_menu_items}
}