import React from "react";
import "./error-page.scss"
import {Link} from "react-router-dom";

export function ErrorPage() {
    return (
        <>
            <h1 id="not-found">Такой страницы не существует</h1>
            <Link to={'/'} className={'on-main'}>На главную</Link>
        </>
    )
}