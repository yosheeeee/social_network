import {useTypeSelector} from "./useTypeSelector";
import {SidebarMenuItemProps} from "../components/SidebarMenu/SidebarMenu";
import {UserState} from "../store/reducers/userReducer/types";
import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import axios from "axios";
import {BACKEND_PATH} from "../constants";

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
            counter: 0
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

    const location = useLocation()
    function getUserNotificationsCount(){
        axios.get(BACKEND_PATH + '/user/notifications/count',
            {
                headers: {
                    Authorization: 'Bearer ' + user.token
                }
            }
            ).then(res => res.data.notifications_count as number)
            .then(data => {
                set_menu_items(prevState => {
                prevState[1].counter = data
                return prevState
            })
                console.log(data)
            })
            .catch(e => console.log(e))
    }


    useEffect(() => {
        if (user.isLoggedIn){
            getUserNotificationsCount()
        }
    }, [location,menu_items[1].isDisabled]);

    useEffect(() => {
        if (user.isLoggedIn) {
            let not_c =0;
            axios.get(BACKEND_PATH + '/user/notifications/count',
                {
                    headers: {
                        Authorization: 'Bearer ' + user.token
                    }
                }
            ).then(res => res.data.notifications_count as number)
                .then(data => {
                    not_c = data
                })
                .catch(e => console.log(e))
            set_menu_items(prevState => {
                prevState[2].link = 'user/' + user.id
                prevState[2].title = "Профиль"
                prevState[1].isDisabled = false
                prevState[1].counter = not_c
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