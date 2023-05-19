import express from "express";
import {
    movieFetchTconst,
    movieFetchSearch,
    addMovieToFavourite,
    removeMovieFromFavourite,
    addGenreToFavourite,
    movieFetchByUserGenre,
    buyMovie,
    rentMovie,
    refundMovie
} from "../controller/movieMethods.mjs";
import { isLogged } from "../middleware/isLogged.mjs";

const router = express.Router();

// (Fetching a movie by tconst)
router.get("/fetch/:tconst", movieFetchTconst);
// (Fetching a movie by name)
router.post("/fetch", movieFetchSearch);
// (Fetching a User's Favourite Genre Movies)
router.post("/fetch/genre", isLogged, movieFetchByUserGenre);
// (Adding a Movie to a User's Favourite)
router.post("/add_favourite/:tconst", isLogged, addMovieToFavourite);
// (Buy a Movie for the User)
router.post("/buyMovie/:tconst", isLogged, buyMovie);
// (Rent a Movie for the User)
router.post("/rentMovie/:tconst", isLogged, rentMovie);
// (Refund a Movie to the User)
router.post("/refundMovie/:tconst", isLogged, refundMovie);
// (Adding a Genre to a User's Favourite)
router.post("/add_genre", isLogged, addGenreToFavourite);
// (Removing a Movie to a User's Favourite)
router.post("/remove_favourite/:tconst", isLogged, removeMovieFromFavourite);


export default router;