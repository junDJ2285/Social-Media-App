import mongoose, { Schema } from "mongoose";

const requestSchema = new Schema({
    requestTo: { type: Schema.Types.ObjectId, ref: "User" },
    requestFrom: { type: Schema.Types.ObjectId, ref: "User" },
    requestStatus: { type: String, default: "pending" },
},
    {
        timestamps: true
    });

const FriendRequest = mongoose.model("FriendRequest", requestSchema);

export default FriendRequest;
