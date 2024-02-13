import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import "./auth-form.scss";
import {BACKEND_PATH} from "../../constants";
import Loader from "../../images/loader.gif";

interface ResponseResult {
    message: string,
    token?: string
}


export function AuthForm() {
    let inputs: { registration: AuthFormInputProps, login: AuthFormInputProps[] } = {
        registration:
            {
                label_text: 'Почта',
                input_name: 'mail',
                input_type: 'email'
            }
        ,
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

    let [is_register, set_is_register] = useState(false)
    let [form_type, set_form_type] = useState("login")
    let [loading, set_loading] = useState(false)

    useEffect(() => {
        if (is_register) {
            set_form_type("registration")
        } else {
            set_form_type('login')
        }
    }, [is_register])

    function sumbitForm(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        let target = e.target as typeof e.target & {
            login: { value: string },
            mail: { value: string },
            password: { value: string }
        }
        let form_data = {
            login: target.login.value,
            password: target.password.value
        }
        let url = BACKEND_PATH + "/auth/"
        if (is_register) {
            // @ts-ignore
            form_data.mail = target.mail.value
            url += "registration"
        } else {
            url += "login"
        }
        set_loading(true)
        axios.post(url, form_data)
            .then(data => {
                set_loading(false)
                let auth_data = data.data as ResponseResult
                console.log(auth_data)
            })
            .catch(e => {
                console.log(e)
                set_loading(false)
            })
    }

    return (
        <div className="auth-form">
            <div className="form-header">
                <AuthTypeButton button_text={"Вход"}
                                auth_type={false}
                                is_register={is_register}
                                set_is_register={set_is_register}/>
                <AuthTypeButton button_text={"Регистрация"}
                                auth_type={true}
                                is_register={is_register}
                                set_is_register={set_is_register}/>
            </div>
            <form data-action={form_type}
                  onSubmit={sumbitForm}>
                {is_register && <AuthFormInput {...inputs.registration}/>}
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
    set_is_register: React.Dispatch<React.SetStateAction<boolean>>
}

function AuthTypeButton({button_text, auth_type, set_is_register, is_register}: AuthTypeButtonProps) {
    return (
        <button disabled={auth_type == is_register}
                onClick={() => set_is_register(auth_type)}>
            {button_text}
        </button>
    )
}

