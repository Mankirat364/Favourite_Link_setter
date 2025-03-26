import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    username : {
        type : String,
        unique  : true,
        required : [ true , "Username is required"],
        minlength : [3 , "Username must be atleast of 3 characters"],
        maxlength : [15, 'Username cannot exceeds 15 characters'],
    },
    email : {
        type :String,
        required : [true,"email is required"],
    },
    password : {
        type : String,
        required : [true , "Password is required"],
        minlength : [6, "Password must be atleast 6 character long"],
        select : false
    }
})
const userModel = mongoose.model('User', userSchema)
export default userModel