import React from "react";
import "./SidebarMenu.scss"
import {NavLink} from "react-router-dom";
import Logo from "../../images/main-logo.svg";
import useNavLinks from "../../hooks/useNavLinks";
import {useTypeSelector} from "../../hooks/useTypeSelector";

export interface SidebarMenuProps {

}

export interface SidebarMenuItemProps {
    icon_name: string,
    title: string,
    link?: string,
}

export function SidebarMenu(props: SidebarMenuProps) {
    let user = useTypeSelector(state => state.user)
    let {menu_items,set_menu_items} = useNavLinks(user)
    return (
        <div className="sidebar_menu">
            <div className="main-logo">
                <img src={Logo}
                     alt="main-logo"/>
                <p>Minds</p>
            </div>
            {menu_items.map(item => SidebarMenuItem(item))}
            {user.isLoggedIn && SidebarMenuItem({ icon_name:"fa-gear", title:"Настройки", link:"settings"})}
        </div>
    )
}

function SidebarMenuItem(props: SidebarMenuItemProps | false) {
    if (props != false){
        const {icon_name, title, link} = props
        return (
            <div className="menu_item">
                <i className={"fa-solid " + icon_name}></i>
                <NavLink to={link ? link : "#"} className={navData => navData.isActive ? "active" : ''}>{title}</NavLink>
            </div>
        )
    }
}