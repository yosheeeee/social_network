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

    static async deleteUserLike(req, res) {
        try {
            const current_user_id = req.current_user.id
            const post_id = req.params.post_id
            console.log(current_user_id, post_id)
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
}