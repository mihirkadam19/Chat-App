import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiverId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text:{
        type: String,
    },
    image: {
        types: String,
    }
},
    {timestamps: true}
);

// "Message" will create a collection in MongoDB as "messages" if it doesn't already exists using the "messageSchema"
const Messsage = mongoose.model("Message", messageSchema);

//exporting the Message model so it can be used in other components
export default Messsage;