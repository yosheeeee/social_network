import React from 'react';
import logo from './logo.svg';
import './App.scss';
import {SidebarMenu} from "./components/SidebarMenu/SidebarMenu";
import {AuthForm} from "./modules/auth-form/auth-form";
import {Outlet, RouterProvider} from "react-router-dom";
import {router} from "./router";


function App() {
  return (
      <>
      <SidebarMenu/>
          <Outlet/>
      </>
  );
}

export default App;
