import mongoose, { Schema, mongo } from "mongoose";

const commentSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref: "user" },
    postId: { type: Schema.Types.ObjectId, ref: "user" },
    comment: { type: String, required: true },
    from: { type: String, required: true },
    replies: [{

        rid: { type: mongoose.Schema.Types.ObjectId, },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        from: { type: String },
        replyAt: { type: String },
        comment: { type: String },
        createAt: { type: Date, default: Date.now },
        updateAt: { type: Date, default: Date.now },
        likes: [{ type: String }]
    }],
    likes: [{ type: String }],

},
    {
        timestamps: true
    })
const Comments = mongoose.model("comments", commentSchema)

export default Comments;