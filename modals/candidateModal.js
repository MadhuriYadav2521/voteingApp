import mongoose from "mongoose";
import { Schema } from "mongoose";

const candidateSchema = new Schema({
    candidateName :{
        type: String,
        require: [true, "Candidate Name is required!"]
    },
    vote:[{
        type : mongoose.Types.ObjectId,
        ref: "Users"
    }]
    
})

export default mongoose.model("Candidates", candidateSchema)