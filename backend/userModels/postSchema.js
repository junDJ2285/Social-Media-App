import mongoose, { Schema } from "mongoose";

const postSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref: user },
    description: { type: String, required: true },
    image: { type: String },
    likes: [{ type: String }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comments" }],
})

const Posts = mongoose.model("Posts", postSchema)

export default Posts;