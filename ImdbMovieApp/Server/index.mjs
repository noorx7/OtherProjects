import cors from 'cors';
import { connectToDB } from "./utils/db.mjs";
import express from "express";
import bodyParser from 'body-parser';
import { isLogged } from "./middleware/isLogged.mjs";
import authRoutes from "./routes/authRoutes.mjs";
import movieRoutes from "./routes/movieRoutes.mjs";
import userRoutes from "./routes/userRoutes.mjs";
import { isAdmin } from "./middleware/isAdmin.mjs";
import cookieParser from 'cookie-parser';


export const app = express();
app.use(cookieParser());
// Serve static files from the "uploads" directory
app.use('/uploads', express.static('uploads'));
const corsConfig = {
    credentials: true,
    origin: true,
};
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors(corsConfig)); // use cors middleware
const port = 4000;

var server
async function createServer() {
    try {
        await connectToDB();
        //Routes
        app.use("/auth", authRoutes);
        app.use("/user", userRoutes)
        app.use("/movie", movieRoutes)

        //(Testing if a user is Logged in and is an Admin)
        app.get('/test', isLogged, (req, res) => {
            res.json('test ok')
        })

    } catch (err) {
        console.log(err)
    }
}
createServer();
console.log(`http://localhost:` + port);

export default { app }


