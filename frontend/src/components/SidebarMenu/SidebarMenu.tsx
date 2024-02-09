import React, {useEffect} from "react";
import "./SidebarMenu.scss"
import menu_items from "./menu_items";
import { Link } from "react-router-dom";
export interface SidebarMenuProps{

}

export interface SidebarMenuItemProps{
    icon_name: string,
    title: string,
    link?:string,
}

export  function SidebarMenu(props: SidebarMenuProps){
    return (
        <div className="sidebar_menu">
            {menu_items.map(item => SidebarMenuItem(item))}
        </div>
    )
}

function SidebarMenuItem(props:SidebarMenuItemProps){
    const {icon_name, title, link} = props
    return (
            <div className="menu_item">
                <i className={"fa-solid "+icon_name}></i>
                <Link to={link ? link : "#"}>{title}</Link>
            </div>
            )
}
