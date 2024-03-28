import "./notifications.scss"
import {useState} from "react";

interface INotification{
    date: number,
    notification_type: string,
    notification_subject: string,
    notification_content: string
}

export default function Notifications(){
    const [notifications, setNotification] = useState<INotification[]>([
        {
            date: 0,
            notification_type: 'comment',
            notification_subject: 'Пользователь оставил комментарий',
            notification_content: 'Пользователь <a href="#">user</a> оставил комментарий <a href="#">Вашей записи</a>'
        },
        {
            date: 0,
            notification_type: 'comment',
            notification_subject: 'Пользователь оставил комментарий',
            notification_content: 'Пользователь <a href="#">user</a> оставил комментарий <a href="#">Вашей записи</a>'
        }
    ])

    return (
        <div id="notifications-page">
            <h1>Уведомления</h1>
            {notifications.length == 0 ?
            <h2>Уведомления отсутствуют</h2> :
                <div className="notifications">
                    {notifications.map(notification => <Notification {...notification}/>)}
                </div>
            }

        </div>
    )
}

function Notification({date, notification_content, notification_subject, notification_type} : INotification){
    const notification_date = new Date()
    let options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        timezone: 'UTC',
        hour: 'numeric',
        minute: 'numeric',
    };

    let icons : {
        [key : string] : string
    } = {
        comment: 'fa-comment',
        like: 'fa-heart'
    }

    return(
        <div className="notification">
            <div className="header">
              <i className={'fa-solid '+ icons[notification_type]}></i>
                <p>{notification_subject}</p>
                <p>{`${notification_date.getHours()}:${notification_date.getMinutes()}`}, {notification_date.toLocaleDateString("ru", {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long',
                })}</p>
            </div>
            <div className="notification-content" dangerouslySetInnerHTML={{__html:notification_content}}>
            </div>
        </div>
    )
}