import React, {useEffect, useState} from "react";
import "./auth-form.scss"


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
    useEffect(() => {
        if (is_register) {
            set_form_type("registration")
        } else {
            set_form_type('login')
        }
    }, [is_register])

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
            <form data-action={form_type}>
                {is_register && <AuthFormInput {...inputs.registration}/>}
                {inputs.login.map(inp => <AuthFormInput {...inp}/>)}
                <input type="submit"
                       value={is_register ? "Зарегистрироватсья" : "Войти"}/>
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
    function showPassword(){
        function mouseDown(e : React.MouseEvent<HTMLDivElement>){
            if (e.button == 0) set_input_type('text')
        }
        function mouseUp(e: React.MouseEvent<HTMLDivElement>){
            set_input_type(input_type)
        }
        return (
            <>
                <div className="show-password-btn" onMouseDown={mouseDown} onMouseUp={mouseUp}>
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

