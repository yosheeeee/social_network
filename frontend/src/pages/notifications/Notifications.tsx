import "./notifications.scss";
import {useEffect, useState} from "react";
import axios from "axios";
import {BACKEND_PATH} from "../../constants";
import {useTypeSelector} from "../../hooks/useTypeSelector";
import Loader from "../../components/Loader/Loader";

interface INotification {
    notification_date: string;
    notification_type: string;
    notification_subject: string;
    notification_content: string;
}

export default function Notifications() {
    const user = useTypeSelector(state => state.user)
    const [notifications, setNotification] = useState<INotification[]>([]);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        if (user.isLoggedIn) {
            axios.get(BACKEND_PATH + '/user/notifications/get',
                {headers: {Authorization: `Bearer ${user.token}`}})
                .then(res => {
                    console.log(res.data)
                    return res.data as INotification[]
                })
                .then(data => setNotification(data))
                .catch(e => console.log(e))
                .finally(() => setLoading(false))
        }
    }, [user.isLoggedIn]);

    return (
        <div id="notifications-page">
            <h1>Уведомления</h1>
            {loading ? <Loader/> : (
                <>
                    {notifications.length == 0 ? (
                        <h2>Уведомления отсутствуют</h2>
                    ) : (
                        <div className="notifications">
                            {notifications.map((notification) => (
                                <Notification {...notification} />
                            ))}
                        </div>
                    )}
                </>
            )
            }

        </div>
    );
}

function Notification({
                          notification_date,
                          notification_content,
                          notification_subject,
                          notification_type,
                      }: INotification) {
    const date = new Date();
    let options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
        timezone: "UTC",
        hour: "numeric",
        minute: "numeric",
    };

    let icons: {
        [key: string]: string;
    } = {
        comment: "fa-comment",
        like: "fa-heart",
    };

    return (
        <div className="notification">
            <div className="header">
                <i className={"fa-solid " + icons[notification_type]}></i>
                <p>{notification_subject}</p>
                <p>
                    {`${date.getHours()}:${date.getMinutes()}`},{" "}
                    {date.toLocaleDateString("ru", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        weekday: "long",
                    })}
                </p>
            </div>
            <div
                className="notification-content"
                dangerouslySetInnerHTML={{__html: notification_content}}
            ></div>
        </div>
    );
}
