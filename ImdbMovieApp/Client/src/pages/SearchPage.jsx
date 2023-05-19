import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import IndexPage from "./IndexPage";
import { useEffect } from "react";
function SearchPage() {
	const {
		movieData,
		setMovieData,
		favMovies,
		setFavMovies,
		favGenres,
		setFavGenres,
		token,
		searchFriendData,
		setSearchFriendData,
	} = useContext(UserContext);
	const [refresh, setRefresh] = useState(false);
	const [searchFavouriteMovies, setSearchFavouriteMovies] = useState([]);

	useEffect(() => {
		async function fetchMovies() {
			if (searchFriendData) {
				const moviePromises = searchFriendData.flatMap((item) => {
					const movieIds = item.favourite;
					return movieIds.map((movieId) => {
						return axios.get(`/movie/fetch/${movieId}`).then((res) => {
							const movieData = res.data.getMovie;
							console.log(movieData);
							return movieData;
						});
					});
				});

				const movieData = await Promise.all(moviePromises);
				setSearchFavouriteMovies(movieData);
			}
		}

		fetchMovies();
	}, [searchFriendData]);

	const addFriend = async (user) => {
		try {
			const id = user._id;
			const response = await axios.post(
				`/user/addFriend/${id}`,
				{},
				{
					headers: {
						Authorization: token,
					},
				}
			);
			setRefresh(true);
			alert(response.data.msg);
		} catch (error) {
			alert(error.response.data.msg);
		}
	};

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

			// Make an axios post request to add the genres to the backend
			const response_Genre = await axios.post(
				"/movie/add_genre",
				{
					genres: genresArr,
				},
				{
					headers: {
						Authorization: token,
					},
				}
			);

			setFavGenres(response_Genre.data.user.genre);

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

	return (
		<div className="flex justify-center mt-4">
			<div className="flex flex-col w-full max-w-screen-lg items-center">
				<div className="bg-white border border-gray-300 p-4 mt-4 w-full mx-2">
					{movieData ? (
						<ul className="bg-gray-100 p-4 rounded-lg">
							<div className="flex justify-center bg-blue-500 text-white text-4xl font-bold mb-4 rounded-lg py-2">
								Results
							</div>
							{movieData.map((movie, index) => {
								const genresArr = movie.genres
									.split(",")
									.map((genre) => genre.replace(/"/g, "").trim());
								return (
									<div
										key={index}
										className="bg-white border border-gray-300 rounded-md p-4 mb-4 shadow-md"
									>
										<div className="flex flex-col">
											<h3 className="text-xl font-bold mb-2">
												{movie.primaryTitle}
											</h3>
											<div className="mb-2">
												<span className="font-bold mr-2">Genre:</span>
												{movie.genres}
											</div>
											<div className="mb-2">
												<span className="font-bold mr-2">Type:</span>
												{movie.titleType}
											</div>
											<button
												className="px-4 py-2 mt-2 text-white bg-blue-500 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
												onClick={() => addMovie(movie.tconst, genresArr)}
											>
												Add to Favorites
											</button>
										</div>
									</div>
								);
							})}
						</ul>
					) : searchFriendData?.length > 0 ? (
						<div className="bg-gray-100 p-4 rounded-lg">
							<div className="flex justify-center bg-blue-500 text-white text-4xl font-bold mb-4 rounded-lg py-2">
								Search People
							</div>
							<ul>
								{console.log(searchFriendData)}
								{searchFriendData.map((user) => (
									<li key={user.id}>
										<div className="my-2">
											<p className="flex items-center">
												<span className="mr-2">
													Name: {user.firstName} {user.lastName}
												</span>
												<button
													className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
													onClick={() => addFriend(user)}
												>
													Add Friend
												</button>
											</p>
											<p class="mt-2  ">
												Favorite:
												{user.favourite &&
												user.favourite.length > 0 &&
												searchFavouriteMovies &&
												searchFavouriteMovies.length > 0
													? user.favourite.map((tconst) => {
															const movie = searchFavouriteMovies.find(
																(movie) => movie[0]?.tconst === tconst
															);
															return movie ? (
																<div key={movie[0].tconst}>
																	<span>{movie[0].primaryTitle}</span>
																</div>
															) : (
																<div key={tconst}>Movie {tconst} not found</div>
															);
													  })
													: "User has no favourite movies yet"}
											</p>
										</div>
									</li>
								))}
							</ul>
						</div>
					) : (
						<div>
							<IndexPage />
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default SearchPage;
