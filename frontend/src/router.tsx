import React from "react";
import {createBrowserRouter, RouteObject} from "react-router-dom";
import {SidebarMenu} from "./components/SidebarMenu/SidebarMenu";
import {AuthForm} from "./modules/auth-form/auth-form";
import {ErrorPage} from "./pages/404/404";
import App from "./App";
const routes : RouteObject[] = [
    {
        path: '/',
        element: <App/>,
        errorElement: <ErrorPage/>,
        children: [
            {
                path : 'auth',
                element: <AuthForm/>
            }
        ]
    }
]
export const router = createBrowserRouter(routes)
