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
    let menu_items = useNavLinks(useTypeSelector(state => state.user))
    return (
        <div className="sidebar_menu">
            <div className="main-logo">
                <img src={Logo}
                     alt="main-logo"/>
                <p>Minds</p>
            </div>
            {menu_items.map(item => SidebarMenuItem(item))}
        </div>
    )
}

function SidebarMenuItem(props: SidebarMenuItemProps) {
    const {icon_name, title, link} = props
    return (
        <div className="menu_item">
            <i className={"fa-solid " + icon_name}></i>
            <NavLink to={link ? link : "#"} className={navData => navData.isActive ? "active" : ''}>{title}</NavLink>
        </div>
    )
}