import {Children, ReactNode, useState} from "react";
import "./slider.scss"

export default function Slider({children, elementsOnPage}: { children: ReactNode, elementsOnPage: number }) {
    const [currentElem, setCurrentElem] = useState(0)
    const childrenLength = Children.count(children)
    const justifyContent = childrenLength <= elementsOnPage ? 'center' : 'normal'

    function moveLeft() {
        setCurrentElem(prevState => prevState >= 1 ? prevState - 1 : childrenLength - elementsOnPage)
    }

    function moveRight() {
        setCurrentElem(prevState => prevState < childrenLength - elementsOnPage ? prevState + 1 : 0)
    }


    return (
        <div className="slider">
            <div className="slider-content-container">
                <div className={"slider-content "+'elements--'+elementsOnPage}
                     style={{transform: `translateX(${-100 / elementsOnPage * currentElem}%)` , justifyContent: justifyContent}}>
                    {children}
                </div>
            </div>
            {
                childrenLength > elementsOnPage ?
                    <>
                        <button className="slider-btn left button rounded"
                                onClick={moveLeft}><i className="fa-solid fa-chevron-left"></i></button>

                        <button
                            onClick={moveRight}
                            className="slider-btn right button rounded"><i className="fa-solid fa-chevron-right"></i>
                        </button>
                    </>
                    :
                    <>
                    </>
            }
        </div>
    )
}