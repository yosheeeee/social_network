import React, {ChangeEventHandler, MutableRefObject, SetStateAction, useEffect, useRef, useState} from "react";
import {useTypeSelector} from "../../hooks/useTypeSelector";
import {useDispatch} from "react-redux";
import {Dispatch} from "redux";
import {UserAction, UserActionTypes} from "../../store/reducers/userReducer/types";
import {useNavigate} from "react-router-dom";
import {BACKEND_PATH} from "../../constants";
import axios from "axios";
import Loader from "../../components/Loader/Loader";
import "./settings.scss"
import {UserData} from "../../hooks/useUserPage";

interface SettingsInput {
    input_type: string,
    value: string,
    name: string,
    label_text: string,
    required: boolean
}

export default function Settings() {
    let initState = [
        {
            input_type: "text",
            value: "",
            name: "login",
            label_text: "Логин",
            required: true
        },
        {
            input_type: "password",
            value: "",
            name: "password",
            label_text: "Смена пароля",
            required: false
        },
        {
            input_type: "password",
            value: "",
            name: "second_password",
            label_text: "Повтор пароля",
            required: false
        },
        {
            input_type: "text",
            value: "",
            name: "name",
            label_text: "Имя",
            required: true
        },
        {
            input_type: "mail",
            value: "",
            name: "mail",
            label_text: "Почта",
            required: true
        }
    ]
    let user = useTypeSelector(state => state.user)
    let userDispatch: Dispatch<UserAction> = useDispatch()
    let navigate = useNavigate()
    let [loading, setLoading] = useState(false)
    let [settings_fields, set_settings_fields] = useState<SettingsInput[]>(initState)
    let [isDataChanged, setIsDataChanged] = useState(false)
    let [userData, setUserData] = useState({
        name: "",
        login: "",
        mail: ""
    })
    let [isPasswordReadyToChange, setIsPasswordReadyToChange] = useState({isEquals: true, isNotEmpty: false})
    let formRef = useRef<HTMLFormElement>()

    // выход пользователя
    function onClick(e: React.MouseEvent<HTMLButtonElement>) {
        userDispatch({type: UserActionTypes.LOGOUT_USER})
        navigate('/')
    }

    // первоначальная подгрузка данных пользователя с сервера
    useEffect(() => {
        if (!user.isLoggedIn) {
            navigate('/')
        } else {
            console.log(user)
            setLoading(true)
            axios.get(BACKEND_PATH + '/user/', {
                headers: {
                    'Authorization': 'Bearer ' + user.token
                }
            })
                .then(res => res.data as UserData)
                .then(data => {
                    setLoading(false)
                    set_settings_fields(prevState => {
                        let newState = [...prevState]
                        newState[0].value = data.user_login as string
                        newState[3].value = data.user_name as string
                        newState[4].value = data.user_mail as string
                        return newState
                    })
                    setUserData({
                        name: data.user_name as string,
                        login: data.user_login as string,
                        mail: data.user_mail as string,
                    })
                })
                .catch(e => {
                    setLoading(false)
                    console.log(e)
                })
        }
    }, [user]);

    // изменение состояния инпутов
    function onChangeValue(e: React.ChangeEvent<HTMLInputElement>, index: number) {
        set_settings_fields(prevState => {
            let newState = [...prevState]
            newState[index].value = e.target.value
            return newState
        })
    }

    // проверка изменения первоначальных данных
    useEffect(() => {
        setIsDataChanged(!(userData.name == settings_fields[3].value && userData.login == settings_fields[0].value && userData.mail == settings_fields[4].value) || isPasswordReadyToChange.isNotEmpty)
    }, [settings_fields, isPasswordReadyToChange]);

    // проверка инпутов паролей на корректность
    useEffect(() => {
        if (settings_fields[1].value != "" || settings_fields[2].value != "") {
            setIsPasswordReadyToChange(prevState => {
                return {isNotEmpty: true, isEquals: settings_fields[1].value == settings_fields[2].value}
            })
        } else {
            setIsPasswordReadyToChange(prevState => {
                return {isEquals: true, isNotEmpty: false}
            })
        }
    }, [settings_fields[1].value, settings_fields[2].value]);

    // отправка измененных данных на сервер
    function submitForm() {
        let user_login = settings_fields[0].value
        let user_mail = settings_fields[4].value
        let user_name = settings_fields[3].value
        if (user_login && user_mail && user_name) {
            setLoading(true);
            let data = {
                user_login: user_login,
                user_name: user_name,
                user_mail: user_mail,
            }
            if (isPasswordReadyToChange.isNotEmpty && isPasswordReadyToChange.isEquals) {
                // @ts-ignore
                data.new_password = settings_fields[1].value
            }
            axios.post(BACKEND_PATH + '/user/changedata',
                data
                , {
                    headers: {
                        'Authorization': 'Bearer ' + user.token
                    }
                })
                .then(res => res.data)
                .then(data => {
                    userDispatch({type: UserActionTypes.AUTH_USER, payload: {token: data.token, id: data.id}})
                    setLoading(false)
                })
                .catch(e => {
                    console.log(e)
                    setLoading(false)
                })
        } else {
            alert("Некоторые поля не заполнены")
        }
    }

    return (
        <div id="settings-page">
            <h1>Настройки</h1>
            <ChangeProfileImage setLoading = {setLoading}/>
            <form id="settings"
                  onSubmit={e => e.preventDefault()}
                  ref={formRef as MutableRefObject<HTMLFormElement>}>
                {loading && <Loader/>}
                {!loading && (settings_fields.map((elem, index) => <SettingsField input={elem}
                                                                                  index={index}
                                                                                  onChange={e => onChangeValue(e, index)}/>))
                }
                {/*<p>{isDataChanged ? "Данные изменились" : "Данные не изменились"}</p>*/}
                {isPasswordReadyToChange.isNotEmpty && <div id={"password-checker"}
                                                            className={isPasswordReadyToChange.isEquals ? "correct" : "wrong"}>{isPasswordReadyToChange.isEquals ? "Пароли совпадают" : "Пароли не совпадают"}</div>}
            </form>
            {
                !loading && (
                    <div className="buttons">
                        <LogoutButton/>
                        {isDataChanged && isPasswordReadyToChange.isEquals &&
                            <SaveDataToServerButton formSubmit={submitForm}/>}
                    </div>
                )
            }
        </div>
    )
}

// поле инпута настроек
function SettingsField(props: {
    input: SettingsInput,
    index: number,
    onChange: ChangeEventHandler<HTMLInputElement>
}) {
    let {input, index, onChange} = props
    let {input_type, name, value, label_text, required} = input

    return (
        <div className="input-container">
            <label htmlFor="">{label_text}{required && <span className="color-red"> *</span>}</label>
            <input type={input_type}
                   value={value}
                   id={"settings-" + name}
                   name={name}
                   autoComplete="off"
                   onChange={onChange}
            />
        </div>
    )
}

// кнопка логаута пользователя
function LogoutButton() {
    let userDispatch: Dispatch<UserAction> = useDispatch()

    function onClick(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
        if (window.confirm("Вы уверены что хотите выйти?")) {
            userDispatch({type: UserActionTypes.LOGOUT_USER})
        }
    }

    return (
        <button onClick={onClick}
                className="button rounded warning-color error logout-button">Выйти из аккаутра</button>
    )
}


// кнопка отправки формы
function SaveDataToServerButton({formSubmit}: { formSubmit: Function }) {

    function buttonClick() {
        formSubmit()
    }

    return (
        <button className="button rounded"
                onClick={buttonClick}>Сохранить данные аккаунта</button>
    )
}

function ChangeProfileImage({setLoading} : {setLoading: any}) {
    let user = useTypeSelector(state => state.user)
    let [selectedFile, setSelectedFile] = useState<File | null>(null)
    let [initFile, setInitFile] = useState<File | null>(null)
    let [isChanged, setIsChanged] = useState(false)

    function changeFileHandler(e: React.ChangeEvent<HTMLInputElement>) {
        // @ts-ignore
        setSelectedFile(e.target.files[0])
        // @ts-ignore
        if (e.target.files.length != 0){
            setIsChanged(true)
        }else{
            setSelectedFile(initFile)
            setIsChanged(false)
        }
    }

    useEffect(() => {
        setLoading(true)
        axios.get(BACKEND_PATH+'/user/image/'+user.id)
            .then(res => res.data)
            .then(data =>  {
                axios.get(BACKEND_PATH+'/static'+data.file_src,
                    {responseType: "blob"})
                    .then(res => res.data as Blob
                    )
                    .then(data => {
                        let userImageFile = new File([data],'user_image')
                        setInitFile(userImageFile)
                        setSelectedFile(userImageFile)
                    })
            })
        setLoading(false)
    }, []);

    function uploadImageToServer() {
        setLoading(true)
        let formData = new FormData()
        formData.append('user_image',selectedFile as File)
        axios.post(BACKEND_PATH+'/user/image',formData , {
            headers:{
                'Authorization': 'Bearer ' + user.token
            }
        })
        setLoading(false)
        setInitFile(selectedFile)
        setIsChanged(false)
    }

    let inputRef = useRef<HTMLInputElement>(null)

    function inputButtonClickHandler(){
        // @ts-ignore
        inputRef.current.click()
    }

    return (
        <div className="user-profile-image-wrapper">
            {selectedFile && <img className="user-image" src={URL.createObjectURL(selectedFile as File)}/> }
            <input type="file"
                   name="user-profile-image"
                   accept=".png,.jpg,.jpeg,.gif"
                   onChange={changeFileHandler}
                   className="hidden"
                   ref={inputRef}
            />
            <div className="buttons">
                <button onClick={inputButtonClickHandler}
                        className="button rounded">Выбрать новое изображение
                </button>
                {isChanged && (
                    <>
                        <button className="button rounded" onClick={uploadImageToServer}>Загрузить изображение</button>
                    </>
                )}
            </div>

        </div>
    )
}