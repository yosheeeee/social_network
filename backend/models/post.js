import {db} from "../db.js";

export default class Post{
    static async addPost(user_id, post_content){
        await db.query('INSERT INTO posts (content, user_id) VALUES ($1,$2)',[post_content, user_id])
    }

    static async getUserPosts(user_id){
        return await db.query('SELECT content,post_date FROM posts WHERE user_id = $1 ORDER BY post_date DESC ',[user_id])
    }
}