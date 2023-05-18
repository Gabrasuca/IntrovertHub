import express from "express";
import { PostModel } from "../model/post.model";
import { UserModel } from "../model/user.model";


const postRouter = express.Router();


postRouter.post('/', isAuth, attachCurrentUser, async (req, res)=>{
    try {
        console.log(req.auth)

        const post = await PostModel.create({...req.body, creator:req.currentUser._id});
        await UserModel.findOneAndUpdate(
            {_id:req.currentUser._id},
            {$push: {posts: post._id}},
            {new: true, runValidators: true},
        )
        return res.status(201).json(post)

    } catch (e) {
        console.error(e);
        return res.status(400).json(e);
    }
});

postRouter.get('/my-posts', isAuth, attachCurrentUser, async( req, res ) =>{
    try {
        const userPosts = await PostModel.find({creator: req.currentUser._id});

        return res.status(200).json(userPosts)
        
    } catch (e) {
        console.error(e);
        return res.status(400).json(e);
    }
})


export {postRouter}