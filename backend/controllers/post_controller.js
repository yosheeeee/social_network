import Post from "../models/post.js";

export default class Post_controller {
    static async postUserLike(req, res) {
        try {
            const current_user_id = req.current_user.id
            const post_id = req.params.post_id
            const check_result = await Post.getUserToPostLikes(current_user_id, post_id)
            if (!check_result.rows[0].isLiked) {
                await Post.postUserLike(current_user_id, post_id)
            }
            return res.status(200).json({
                message: "liked"
            })
        } catch (e) {
            return res.status(400).json({
                e: e.message,
                function: "postUserLike"
            })
        }
    }

    static async deletePost(req,res){
        try{
            const post_id = req.params.post_id
            await Post.deletePost(post_id)
            return res.status(200).json(
                {
                    message: "ok"
                }
            )
        }catch(e){
            console.log(e)
            return res.status(400).json(
                {
                    e: e.message,
                    function: "deletePost"
                }
            )
        }
    }

    static async deleteComment(req,res){
        try{
            const comment_id = req.params.comment_id
            await Post.deleteComment(comment_id)
            return res.status(200).json(
                {
                    message: "ok"
                }
            )
        }catch(e){
            console.log(e)
            return res.status(400).json(
                {
                    e: e.message,
                    function: "deleteComment"
                }
            )
        }
    }

    static async getPostImages(req,res){
        try{
            const post_id = req.params.post_id
            let query_res = await Post.getPostImages(post_id)
            query_res = query_res.rows.length ? query_res.rows : []
            return res.status(200).json({
                images: query_res
            })
        }catch(e){
            console.log(e)
            return res.status(400).json({
                error: e,
                funciton: 'getPostImages'
            })
        }
    }

    static async deleteUserLike(req, res) {
        try {
            const current_user_id = req.current_user.id
            const post_id = req.params.post_id
            const query_res = await Post.deleteUserLike(current_user_id, post_id)
            // console.log(query_res)
            return res.status(200).json({
                message: "like deleted"
            })
        } catch (e) {
            console.log(e)
            return res.status(400).json(
                {
                    e: e.message,
                    function: "deleteUserLike"
                }
            )
        }
    }

    static async getPostComments(req,res){
        try{
            let post_id = req.params.post_id
            let query_res  = await Post.getPostComments(post_id)
            let comments = query_res.rows?.length ? query_res.rows : []
            return res.status(200).json(
                {comments: comments}
            )
        }catch(e){
            return res.status(400).json({
                e: e.message,
                function: "getPostComments"
            })
        }
    }

    static async addComment(req,res){
        try{
            const current_user_id = req.current_user.id
            const comment_content  =req.body.comment_content
            const post_id  = req.body.post_id
            await Post.postComment(current_user_id, post_id, comment_content)
            return res.status(200).json({
                message: "ok"
            })
        }catch(e){
            return res.status(400).json({
                e: e.message,
                function: "addComment"
            })
        }
    }
}