import React, {ChangeEventHandler, useEffect, useState} from "react";
import {useTypeSelector} from "../../hooks/useTypeSelector";
import {useDispatch} from "react-redux";
import {Dispatch} from "redux";
import {UserAction, UserActionTypes} from "../../store/reducers/userReducer/types";
import {useNavigate} from "react-router-dom";
import {BACKEND_PATH} from "../../constants";
import axios from "axios";
import {UserData} from "../UserPage/userPage";
import Loader from "../../components/Loader/Loader";
import "./settings.scss"

interface SettingsInput {
    input_type: string,
    value: string,
    name: string,
    label_text: string
}

export default function Settings() {
    let initState = [
        {
            input_type: "text",
            value: "",
            name: "login",
            label_text: "Логин"
        },
        {
            input_type: "password",
            value: "",
            name: "password",
            label_text: "Смена пароля"
        },
        {
            input_type: "password",
            value: "",
            name: "second_password",
            label_text: "Повтор пароля"
        },
        {
            input_type: "text",
            value: "",
            name: "name",
            label_text: "Имя"
        }
    ]
    let user = useTypeSelector(state => state.user)
    let userDispatch: Dispatch<UserAction> = useDispatch()
    let navigate = useNavigate()
    let [loading, setLoading] = useState(false)
    let [settings_fields, set_settings_fields] = useState<SettingsInput[]>(initState)
    let [isDataChanged, setIsDataChanged] = useState(false)
    let [userData , setUserData] = useState({
        name: "",
        login: "",
    })
    let [isPasswordReadyToChange , setIsPasswordReadyToChange] =useState({isEquals: true, isNotEmpty: false})

    function onClick(e: React.MouseEvent<HTMLButtonElement>) {
        userDispatch({type: UserActionTypes.LOGOUT_USER})
        navigate('/')
    }

    useEffect(() => {
        if (!user.isLoggedIn) {
            navigate('/')
        } else {
            setLoading(true)
            axios.get(BACKEND_PATH + '/user/' + user.id)
                .then(res => res.data as UserData)
                .then(data => {
                    setLoading(false)
                    set_settings_fields(prevState => {
                        let newState = [...prevState]
                        newState[0].value = data.user_login as string
                        newState[3].value = data.user_name as string
                        return newState
                    })
                    setUserData({
                        name: data.user_name as string,
                        login: data.user_login as string
                    })
                })
                .catch(e => {
                    setLoading(false)
                    console.log(e)
                })
        }
    }, [user.isLoggedIn]);

    function onChangeValue(e: React.ChangeEvent<HTMLInputElement>, index: number) {
        set_settings_fields(prevState => {
            let newState = [...prevState]
            newState[index].value = e.target.value
            return newState
        })
    }

    useEffect(() => {
        setIsDataChanged(!(userData.name == settings_fields[3].value && userData.login == settings_fields[0].value) || isPasswordReadyToChange.isNotEmpty)
    }, [settings_fields, isPasswordReadyToChange]);

    useEffect(() => {
        if (settings_fields[1].value != "" || settings_fields[2].value != ""){
            setIsPasswordReadyToChange(prevState => {
                return {isNotEmpty: true, isEquals: settings_fields[1].value == settings_fields[2].value}
            })
        }else{
            setIsPasswordReadyToChange(prevState => {
                return {...prevState, isNotEmpty: false}
            })
        }
    }, [settings_fields[1].value,settings_fields[2].value]);

    return (
        <div id="settings-page">
            <h1>Настройки</h1>
            <form id="settings">
                {loading && <Loader/>}
                {!loading && (settings_fields.map((elem, index) => <SettingsField input={elem}
                                                                                  index={index}
                                                                                  onChange={e => onChangeValue(e, index)}/>))
                }
                <p>{isDataChanged ? "Данные изменились" : "Данные не изменились"}</p>
                {isPasswordReadyToChange.isNotEmpty && <div id={"password-checker"} className={isPasswordReadyToChange.isEquals ? "correct" : "wrong"}>{isPasswordReadyToChange.isEquals ? "Пароли совпадают" : "Пароли не совпадают"}</div> }
            </form>
            <div className="buttons">
                <LogoutButton/>
                {isDataChanged && isPasswordReadyToChange.isEquals && <SaveDataToServerButton/>}
            </div>
        </div>
    )
}


function SettingsField(props: {
    input: SettingsInput,
    index: number,
    onChange: ChangeEventHandler<HTMLInputElement>
}) {
    let {input, index, onChange} = props
    let {input_type, name, value, label_text} = input

    return (
        <div className="input-container">
            <label htmlFor="">{label_text}</label>
            <input type={input_type}
                   value={value}
                   id={"settings-" + name}
                   name={name}
                   onChange={onChange}
            />
        </div>
    )
}

function LogoutButton(){
    let userDispatch: Dispatch<UserAction> = useDispatch()
    function onClick(e: React.MouseEvent<HTMLButtonElement>){
        e.preventDefault()
        if (window.confirm("Вы уверены что хотите выйти?")){
            userDispatch({type: UserActionTypes.LOGOUT_USER})
        }
    }
    return (
        <button onClick={onClick} className="button rounded warning-color error logout-button">Выйти из аккаутра</button>
    )
}


function SaveDataToServerButton(){

    return (
        <button className="button rounded">Сохранить данные аккаунта</button>
    )
}
