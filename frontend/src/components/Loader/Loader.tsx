import React from "react";
import loaderGif from "../../images/loader.gif"

export default function Loader() {
    return (
        <div id="loader">
            <img src={loaderGif}
                 alt="loader"/>
        </div>
    )
}