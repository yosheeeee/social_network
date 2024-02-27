import React from "react";
import {createBrowserRouter, RouteObject} from "react-router-dom";
import {SidebarMenu} from "./components/SidebarMenu/SidebarMenu";
import {AuthForm} from "./modules/auth-form/auth-form";
import {ErrorPage} from "./pages/404/404";
import App from "./App";
import {Feed} from "./pages/feed/feed";
import UserPage from "./pages/UserPage/userPage";
import Settings from "./pages/settings/settings";
const routes : RouteObject[] = [
    {
        path: '/',
        element: <App/>,
        errorElement: <ErrorPage/>,
        children: [
            {
              path: '',
              element: <Feed/>
            },
            {
                path : 'auth',
                element: <AuthForm/>
            },
            {
                path: 'user/:id',
                element: <UserPage/>
            },
            {
                path:'settings',
                element: <Settings/>
            }
        ]
    }
]
export const router = createBrowserRouter(routes)
