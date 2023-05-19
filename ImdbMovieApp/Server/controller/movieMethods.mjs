import titleBasics from "../model/titleBasicsDB.mjs";
import User from "../model/User.mjs";

/* Get a movie document by Tconst */
export const movieFetchTconst = async (req, res) => {
    try {

        const tconst = req.params['tconst']
        const getMovie = await titleBasics.find({ tconst: tconst });

        if (!getMovie) return res.status(400).json({ msg: "Movie does not exist. " });
        return res.status(200).json({ msg: `Movie Document`, getMovie });


    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal server error" });
    }
};









//Fetch Movie by Title 
export const movieFetchSearch = async (req, res) => {
    try {
        const name = req.body.name;
        console.log(name)
        const regex = new RegExp(name, 'i');
        let query = { primaryTitle: regex };

        const getMovie = await titleBasics.find(query).limit(10);

        // Return 10 instances of the match
        const movieMatch = getMovie.find(movie => movie.primaryTitle === name);
        if (movieMatch) {
            getMovie.splice(getMovie.indexOf(movieMatch), 1);
            getMovie.unshift(movieMatch);
        }

        return res.status(200).json({ msg: `Movie Document`, getMovie });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal server error" });
    }
};

/* Add a movie to a User's Favourite Array */
export const addMovieToFavourite = async (req, res) => {
    try {

        const tconst = req.params['tconst']
        const getMovie = await titleBasics.find({ tconst: tconst });
        if (!getMovie) return res.status(400).json({ msg: "Movie does not exist. " });


        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) return res.status(400).json({ msg: "User not found." });


        if (user.favourite.includes(tconst)) {
            return res.status(400).json({ msg: "Movie already favorited." });
        }

        user.favourite.push(tconst);
        await user.save();
        res.status(200).json({ msg: "Movie added to favourites.", user: user });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal server error" });
    }
};



/* Buy a movie to for a User */
export const buyMovie = async (req, res) => {
    try {

        const tconst = req.params['tconst']
        const getMovie = await titleBasics.find({ tconst: tconst });
        if (!getMovie) return res.status(400).json({ msg: "Movie does not exist. " });


        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) return res.status(400).json({ msg: "User not found." });


        const updatedWalletAmount = user.walletAmount - 10;
        if (updatedWalletAmount < 0) {
            return res.status(400).json({ msg: "Insufficient funds." });
        }

        if (user.rentedMovies.includes(tconst)) {
            return res.status(400).json({ msg: "Can't buy this movie! You are already renting this silly!" });
        }

        if (user.boughtMovies.includes(tconst)) {
            return res.status(400).json({ msg: "Can't buy this movie! You have already bought this silly!" });
        }


        user.walletAmount = updatedWalletAmount;
        user.boughtMovies.push(tconst);
        await user.save();
        res.status(200).json({ msg: "Movie bought successfully.", user: user });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal server error" });
    }
};


/* Rent a movie to for a User */
export const rentMovie = async (req, res) => {
    try {

        const tconst = req.params['tconst']
        const getMovie = await titleBasics.find({ tconst: tconst });
        if (!getMovie) return res.status(400).json({ msg: "Movie does not exist. " });


        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) return res.status(400).json({ msg: "User not found." });


        const updatedWalletAmount = user.walletAmount - 5;
        if (updatedWalletAmount < 0) {
            return res.status(400).json({ msg: "Insufficient funds." });
        }

        if (user.boughtMovies.includes(tconst)) {
            return res.status(400).json({ msg: "Can't rent this movie! You already bought this silly!" });
        }

        if (user.rentedMovies.includes(tconst)) {
            return res.status(400).json({ msg: "Can't rent this movie! You have already rent this silly!" });
        }


        user.walletAmount = updatedWalletAmount;
        user.rentedMovies.push(tconst);
        await user.save();
        res.status(200).json({ msg: "Movie rented successfully.", user: user });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal server error" });
    }
};


/* Refund a movie to a User */
export const refundMovie = async (req, res) => {
    try {
        const tconst = req.params['tconst'];
        const getMovie = await titleBasics.findOne({ tconst: tconst });
        if (!getMovie) return res.status(400).json({ msg: 'Movie does not exist.' });

        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) return res.status(400).json({ msg: 'User not found.' });

        if (!user.boughtMovies.includes(tconst) && !user.rentedMovies.includes(tconst)) {
            return res.status(400).json({ msg: 'Movie is neither bought nor rented.' });
        }

        let refundAmount = 0;
        if (user.boughtMovies.includes(tconst)) {
            user.boughtMovies.pull(tconst);
            refundAmount += 10;
        } else {
            user.rentedMovies.pull(tconst);
            refundAmount += 5;
        }

        user.walletAmount += refundAmount;
        await user.save();

        return res.json({ msg: `Refunded ${refundAmount} credits to ${user.firstName}.` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Internal server error' });
    }
};


//Fetch Movies By User's Favourite Genre
export const movieFetchByUserGenre = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) return res.status(400).json({ msg: "User not found." });

        const genres = user.genre; // Get the user's genres
        console.log("A User's Favourite Genres")
        console.log(genres)

        // Build the query to fetch movies matching the user's genres
        const regex = new RegExp(genres.join('|'), 'i');
        const query = [
            { $match: { genres: { $in: genres } } },
            { $group: { _id: "$genres", movies: { $push: "$$ROOT" } } },
            { $project: { movies: { $slice: ['$movies', 2 * genres.length] } } },
            { $unwind: "$movies" },
            { $replaceRoot: { newRoot: "$movies" } },
            { $sample: { size: 10 } }
        ];
        // Fetch the movies from the database
        const getMovies = await titleBasics.aggregate(query);

        return res.status(200).json({ msg: `Movies with genres ${genres.join(', ')}`, getMovies });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal server error" });
    }
};




/* Add a movie to a User's Favourite Array */
export const addGenreToFavourite = async (req, res) => {
    try {

        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) return res.status(400).json({ msg: "User not found." });

        let genres = req.body.genres;
        if (!genres) return res.status(400).json({ msg: "No genres provided." });


        // Add new genres to user's genre array
        user.genre.push(...genres);
        console.log("Adding new Genres")
        console.log(user.genre)
        // Keep only the 5 most recent unique entries
        if (user.genre.length > 5) {
            user.genre = [...new Set(user.genre.slice(user.genre.length - 5))];
        }

        await user.save();
        res.status(200).json({ msg: "Genres added to favourites.", user: user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal server error." });
    }
};

/* Remove a movie to a User's Favourite Array */
export const removeMovieFromFavourite = async (req, res) => {
    try {

        const tconst = req.params['tconst']
        const getMovie = await titleBasics.find({ tconst: tconst });
        if (!getMovie) return res.status(400).json({ msg: "Movie does not exist. " });


        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) return res.status(400).json({ msg: "User not found." });

        const index = user.favourite.indexOf(tconst);
        if (index > -1) {
            user.favourite.splice(index, 1);
            await user.save();
            res.status(200).json({ msg: "Movie removed from favourites." });
        } else {
            res.status(400).json({ msg: "Movie not found in favourites." });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal server error" });
    }
};