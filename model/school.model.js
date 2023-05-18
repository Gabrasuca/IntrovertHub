import { Schema, model, Types } from "mongoose";

const schoolSchema = new Schema({
  name: { type: String, required: true },
  school: [{type: Types.ObjectId, ref: "User"}],
});

export const SchoolModel = model("School", schoolSchema);