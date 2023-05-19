import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";

function IndexPage() {
	const { user, favGenres, token, favMovies, setFavMovies } =
		useContext(UserContext);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [movies, setMovies] = useState([]);
	const [refresh, setRefresh] = useState(false);
	const addMovie = async (tconst, genresArr) => {
		try {
			const response = await axios.post(
				`/movie/add_favourite/${tconst}`,
				{},
				{
					headers: {
						Authorization: token,
					},
				}
			);

			// Add the fav movie from the  favMovie state
			setFavMovies((prevState) => {
				console.log("Adding", tconst, "to favMovie state");
				return [...prevState, tconst];
			});

			setRefresh(true);
			console.log(response.data.message);
		} catch (error) {
			console.error(error.message);
		}
	};

	if (refresh) {
		setTimeout(() => {
			window.location.reload();
		}, 500); // wait for 1 second before refreshing the page
	}

	useEffect(() => {
		const fetchMovies = async () => {
			setLoading(true);
			try {
				const response = await axios.post(
					"movie/fetch/genre",
					{},
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);

				setMovies(response.data.getMovies);
			} catch (error) {
				setError(error.response.data.msg);
			}
			setLoading(false);
		};
		fetchMovies();
	}, [favGenres]);

	if (loading) {
		return <div>Loading movies...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<div>
			<div className="bg-blue-500 w-full h-32 flex justify-center items-center mb-5">
				<h1 className="text-white text-3xl font-bold">Home Page</h1>
			</div>
			{user ? (
				<>
					<div className="mx-2">
						Movies you may like: {favGenres.join(", ")}
					</div>
					<div className="mt-4 px-4 py-2 bg-gray-100 rounded-lg">
						<ul className="list-disc list-inside">
							{movies &&
								movies.map((movie) => (
									<li
										key={movie._id}
										className="flex justify-between items-center py-2 border-b border-gray-300"
									>
										<div>
											<p className="text-lg font-medium">
												{movie.primaryTitle}
											</p>
											<p className="text-gray-500">{movie.genres}</p>
										</div>
										<button
											className="px-4 py-2 ml-4 text-white bg-blue-500 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
											onClick={() => addMovie(movie.tconst)}
										>
											Add to favorites
										</button>
									</li>
								))}
						</ul>
					</div>
				</>
			) : (
				<p>Login for Personalized Movie Suggestions!</p>
			)}
		</div>
	);
}

export default IndexPage;
