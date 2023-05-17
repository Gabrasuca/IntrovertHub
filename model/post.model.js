import { Schema, model, Types } from "mongoose";

const postSchema = new Schema({
  title: { type: String, required: true, trim: true },
  postBody: { type: String, required: true },
  creator: { type: Types.ObjectId, ref: "User" }
});

export const PostModel = model("Post", postSchema);