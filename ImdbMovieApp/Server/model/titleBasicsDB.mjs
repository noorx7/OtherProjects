
import mongoose from "mongoose";


const titleBasicsSchema = new mongoose.Schema( // creating a schema for the name basics file info
    {
        tconst: { type: String, required: true, unique: true },
        titleType: { type: String },
        primaryName: { type: String, required: true },
        genres: { type: String }

    },
    { collection: 'titleBasics' },
    { timestamps: true }
);

const titleBasics = mongoose.model("titleBasics", titleBasicsSchema);
export default titleBasics;
