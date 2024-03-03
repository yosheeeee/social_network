import {db} from "../db.js";


export default class DbFile{
    static async DeleteFiles(meta_key, meta_value){
        await db.query('DELETE FROM files WHERE meta_key = $1 AND meta_value=$2',[meta_key,meta_value])
    }

    static async AddFile(file_src, meta_key,meta_value){
        await db.query('INSERT INTO files  (file_src,meta_key,meta_value) VALUES ($1,$2,$3)',[file_src,meta_key,meta_value])
    }

    static async GetFiles(meta_key,meta_value){
        let query_res = await db.query('SELECT * FROM files WHERE meta_key = $1 AND  meta_value = $2',[meta_key,meta_value])
        return query_res.rows
    }
}