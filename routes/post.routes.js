import express from "express"
import { PostModel } from "../model/post.model.js";
import isAuth from "../middlewares/isAuth.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";

const postRouter = express.Router();

postRouter.post("/", isAuth, attachCurrentUser, async (req, res) => {
        try {
            console.log(req.currentUser);

        const post = await PostModel.create({
            ...req.body, 
            creator: req.currentUser._id,
        });

        await UserModel.findOneAndUpdate(
            { _id: req.currentUser._id }, 
            { $push: { posts: post._id } },
            { new : true, runValidators : true}
            );

        return res.status(201).jason(post);
    } catch (e) {
        console.log(e)
        return res.status(400).json(e)
    }
});


postRouter.get("/", isAuth, attachCurrentUser, async (req, res) => {
    try {
        const userPosts = await PostModel.find({creator: req.currentUser._id})

        return res.status(200).json(userPosts);


    } catch (e) {
        console.log(e)
        return res.status(400).json(e)
    }
})





export { postRouter };