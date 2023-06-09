import { Schema, model, Types } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  location: {type: String, required: true, trim: true},
  job: {type: String, required: true, trim: true},
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/gm,
  },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["ADMIN", "USER"], default: "USER" },
  createdAt: { type: Date, default: Date.now() },
  posts: [{type: Types.ObjectId, ref: "Post"}],
  school: {type: Types.ObjectId, ref: "School", required: true}
});

export const UserModel = model("User", userSchema);
