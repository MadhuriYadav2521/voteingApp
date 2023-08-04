import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema({
    userName :{
        type: String,
        require: [true, "Username is required!"]
    },
    email :{
        type: String,
        require: [true, "Email is required!"]
    },
    password :{
        type: String,
        require: [true, "Password is required!"]
    },
    phone :{
        type: Number,
        require: [true, "Phone number is required!"]
    },
    role : {
        type : String,
        default: "voter"
    }
})

export default mongoose.model("Users", userSchema)