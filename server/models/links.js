import mongoose, { mongo } from "mongoose";

const linkSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true,
      },
    title : {
        type : String,
        required : [true,"Title is required"]
    },
    url  : {
        type : String,
        required : [true, "Url is required"]
    },
    description : {
        type : String,
    },
    tags : [String],
    isPublic : {
        type : Boolean,
        default : false
    },
    likes : {type : Number , default : 0},

}, {
    timestamps: true, 
})

const linkModel = mongoose.model("Link", linkSchema);

export default linkModel