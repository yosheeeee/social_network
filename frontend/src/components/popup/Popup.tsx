import {ReactNode} from "react";
import "./popup.scss"

export default function Popup({showPopup, setShowPopup, children}: {
    showPopup: boolean,
    setShowPopup: (state : boolean) => void,
    children: ReactNode
}) {

    function closePopup() {
        setShowPopup(false)
    }

    return (
        <>
            {showPopup && (
                <div id="blur">
                    <div className="popup">
                        <button onClick={closePopup} className="close-btn"><i className="fa-solid fa-xmark"/></button>
                        {children}
                    </div>
                </div>
            )
            }
        </>
    )
}