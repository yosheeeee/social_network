import React, { useEffect } from "react";
import "./App.scss";
import { SidebarMenu } from "./components/SidebarMenu/SidebarMenu";
import { Outlet, RouterProvider } from "react-router-dom";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useTypeSelector } from "./hooks/useTypeSelector";
import { useDispatch } from "react-redux";
import {
  UserAction,
  UserActionTypes,
} from "./store/reducers/userReducer/types";
import { Dispatch } from "redux";

function App() {
  let [userCookie, setUserCookie] = useLocalStorage("user", null);
  let user = useTypeSelector((state) => state.user);
  let userDispatch: Dispatch<UserAction> = useDispatch();

  useEffect(() => {
    if (userCookie) {
      userDispatch({
        type: UserActionTypes.AUTH_USER,
        payload: { token: userCookie.token, id: userCookie.id as number },
      });
    }
  }, []);
  useEffect(() => {
    if (user.isLoggedIn) {
      setUserCookie({
        token: user.token,
        id: user.id,
      });
    } else {
      setUserCookie(null);
    }
  }, [user]);
  return (
    <>
      <SidebarMenu />
      <Outlet />
    </>
  );
}

export default App;
