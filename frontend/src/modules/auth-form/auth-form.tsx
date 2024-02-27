import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import "./auth-form.scss";
import {BACKEND_PATH} from "../../constants";
import Loader from "../../images/loader.gif";
import {useTypeSelector} from "../../hooks/useTypeSelector";
import {useDispatch} from "react-redux";
import {AuthFromActionType, AuthFromActionTypes} from "../../store/reducers/authForm/types";
import {Dispatch} from "redux";
import {UserAction, UserActionTypes} from "../../store/reducers/userReducer/types";
import {useNavigate} from "react-router-dom";
import {useLocalStorage} from "../../hooks/useLocalStorage";

interface ResponseResult {
    message: string,
    token?: string,
    id?: number
}


export function AuthForm() {
    let inputs: { registration: AuthFormInputProps[], login: AuthFormInputProps[] } = {
        registration: [
            {
                label_text: 'Имя',
                input_type: 'text',
                input_name: 'name'
            },
            {
                label_text: 'Почта',
                input_name: 'mail',
                input_type: 'email'
            }
        ],
        login: [
            {
                label_text: "Логин",
                input_type: 'text',
                input_name: 'login'
            },
            {
                label_text: "Пароль",
                input_name: 'password',
                input_type: 'password'
            }
        ]
    }
    let {is_register, form_type, loading} = useTypeSelector(state => state.authForm)
    let loadingDispatch: Dispatch<AuthFromActionType> = useDispatch()
    let authUserDispatch: Dispatch<UserAction> = useDispatch()
    let [userCookie, setUserCookie] = useLocalStorage("user", null)
    let user = useTypeSelector(state => state.user)
    let navigate = useNavigate()

    useEffect(() => {
        if (user.isLoggedIn) {
            navigate('/')
        }
    }, []);

    useEffect(() => {
        console.log(user)
        if (user.isLoggedIn) {
            navigate('/user/' + user.id)
        }
    }, [user])

    function sumbitForm(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        let target = e.target as typeof e.target & {
            login: { value: string },
            mail: { value: string },
            password: { value: string },
            name: {value : string}
        }
        let form_data = {
            login: target.login.value,
            password: target.password.value
        }
        let url = BACKEND_PATH + "/auth/"
        if (is_register) {
            // @ts-ignore
            form_data.mail = target.mail.value
            // @ts-ignore
            form_data.name = target.name.value
            url += "registration"
        } else {
            url += "login"
        }
        loadingDispatch({type: AuthFromActionTypes.SET_LOADING, payload: true})
        axios.post(url, form_data)
            .then(data => {
                loadingDispatch({type: AuthFromActionTypes.SET_LOADING, payload: false})
                let auth_data = data.data as ResponseResult
                if (data.status == 200) {
                    console.log(auth_data)
                    authUserDispatch({
                        type: UserActionTypes.AUTH_USER,
                        payload: {token: auth_data.token as string, id: auth_data.id as number}
                    })
                }
            })
            .catch(e => {
                console.log(e)
                loadingDispatch({type: AuthFromActionTypes.SET_LOADING, payload: false})
            })
    }

    return (
        <div className="auth-form">
            <div className="form-header">
                <AuthTypeButton button_text={"Вход"}
                                auth_type={false}
                                is_register={is_register}
                />
                <AuthTypeButton button_text={"Регистрация"}
                                auth_type={true}
                                is_register={is_register}
                />
            </div>
            <form data-action={form_type}
                  onSubmit={sumbitForm}>
                {is_register && inputs.registration.map(input => <AuthFormInput {...input}/>) }
                {inputs.login.map(inp => <AuthFormInput {...inp}/>)}
                <input type="submit"
                       value={is_register ? "Зарегистрироватсья" : "Войти"}/>
                <div className="loader">{loading && <img src={Loader}
                                                         alt="loader"/>}</div>
            </form>
        </div>
    )

}

interface AuthFormInputProps {
    label_text: string,
    input_name: string,
    input_type: string,
}

function AuthFormInput({label_text, input_type, input_name}: AuthFormInputProps) {

    let [input_type_state, set_input_type] = useState(input_type);
    let eyeRef = useRef<HTMLDivElement>(null)

    function showPassword() {
        function mouseDown(e: React.MouseEvent<HTMLDivElement>) {
            if (e.button == 0) {
                set_input_type('text')
                // @ts-ignore
                eyeRef.current.classList.add('active')
            }
        }

        function mouseUp(e: React.MouseEvent<HTMLDivElement>) {
            set_input_type(input_type)
            // @ts-ignore
            eyeRef.current.classList.remove('active')
        }

        return (
            <>
                <div className="show-password-btn"
                     onMouseDown={mouseDown}
                     onMouseUp={mouseUp}
                     ref={eyeRef}>
                    <i className="fa-regular fa-eye"></i>
                </div>
            </>
        )
    }

    return (
        <div className='input-container'>
            <label htmlFor={input_name}>{label_text}</label>
            <input type={input_type_state}
                   name={input_name}
                   id={input_name}
                   required/>
            {label_text == "Пароль" ? showPassword() : ""}
        </div>
    )
}

interface AuthTypeButtonProps {
    button_text: string,
    auth_type: boolean,
    is_register: boolean,
}

function AuthTypeButton({button_text, auth_type, is_register}: AuthTypeButtonProps) {
    let dispatch: Dispatch<AuthFromActionType> = useDispatch()
    return (
        <button disabled={auth_type == is_register}
                onClick={() => dispatch({type: AuthFromActionTypes.SET_FORM_TYPE, payload: auth_type})}>
            {button_text}
        </button>
    )
}

