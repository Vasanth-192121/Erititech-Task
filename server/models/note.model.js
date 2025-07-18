import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    title : { type : String, required : true },
    desc : { type : String, require : true },
    userId : { type : String,},
    createdOn: { type: Date, default: Date.now },
}); 

const Note = mongoose.model("Note", noteSchema);

export default Note;