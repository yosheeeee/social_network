import {useTypeSelector} from "./useTypeSelector";
import {SidebarMenuItemProps} from "../components/SidebarMenu/SidebarMenu";
import {UserState} from "../store/reducers/userReducer/types";
import {useEffect, useState} from "react";

export default function useNavLinks(user: UserState){
    let [menu_items, set_menu_items] = useState([
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
            link: user.isLoggedIn ? 'user/'+user.id : 'auth'
        }
    ])

    useEffect(() => {
        if(user.isLoggedIn){
            set_menu_items(prevState => {
                prevState[3].link = 'user/'+user.id
                return prevState
            })
        }else{
            set_menu_items(prevState => {
                prevState[3].link ='auth'
                return prevState
            })
        }
    }, [user]);

    return {menu_items,set_menu_items}
}