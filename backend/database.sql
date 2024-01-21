create TABLE users(
    user_id SERIAL PRIMARY KEY,
    user_firstname VARCHAR(100),
    user_lastname VARCHAR(100),
    user_login VARCHAR(100),
);

create TABLE post(
    id SERIAL PRIMARY KEY ,
    content CHAR,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users (user_id)
)