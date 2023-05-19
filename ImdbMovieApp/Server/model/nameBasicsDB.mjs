
import mongoose from "mongoose";


const nameBasicsSchema = new mongoose.Schema( // creating a schema for the name basics file info
    {
        nconst: { type: String, required: true, unique: true },
        primaryName: { type: String, required: true },
        birthYear: { type: Number, required: true },
        deathYear: { type: Number },
        primaryProfession: { type: mongoose.Schema.Types.Mixed },
        knownForTitles: { type: String }

    },
    { collection: 'nameBasics' },
    { timestamps: true }
);

const nameBasics = mongoose.model("nameBasics", nameBasicsSchema);
export default nameBasics;
 