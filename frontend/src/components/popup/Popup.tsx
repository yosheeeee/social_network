import {ReactNode} from "react";
import "./popup.scss"

export default function Popup({showPopup, setShowPopup, children}: {
    showPopup: boolean,
    setShowPopup: React.Dispatch<React.SetStateAction<boolean>>,
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