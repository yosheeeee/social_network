import pg from 'pg'
const Pool = pg.Pool
const pool = new Pool({
    user:'postgres',
    password:'1379',
    host:'localhost',
    port: 5432,
    database:'node_backend'
})

export {pool as db};