import { Link, Navigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";

function Clock() {
	const [time, setTime] = useState(new Date().toLocaleTimeString());

	useEffect(() => {
		const interval = setInterval(() => {
			setTime(new Date().toLocaleTimeString());
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	return <div>{time}</div>;
}

function App() {
	return (
		<div>
			<h1>Current Time:</h1>
			<Clock />
		</div>
	);
}

function AccountPage() {
	const [refresh, setRefresh] = useState(false);
	const {
		user,
		favMovies,
		token,
		setFavMovies,
		profilePath,
		boughtMovies,
		setBoughtMovies,
		rentedMovies,
		setRentedMovies,
		friends,
	} = useContext(UserContext);
	const [localFriends, setLocalFriends] = useState([]);

	useEffect(() => {
		async function fetchFriends() {
			if (friends) {
				const friendPromises = friends.map((friendId) => {
					console.log(friendId);
					return axios.get(`/user/getUser/${friendId}`).then((res) => {
						const friendData = res.data.user;
						console.log(friendData);
						return friendData;
					});
				});
				const friendData = await Promise.all(friendPromises);
				setLocalFriends(friendData);
			}
		}
		fetchFriends();
	}, [friends]);

	useEffect(() => {
		async function fetchMovies() {
			if (user) {
				if (user.favourite) {
					const moviePromises = user.favourite.map((movieId) =>
						axios
							.get(`/movie/fetch/${movieId}`)
							.then((res) => res.data.getMovie)
					);
					const movieData = await Promise.all(moviePromises);

					setFavMovies(movieData);
				}

				if (user.rentedMovies) {
					const movieRentPromises = user.rentedMovies.map((movieId) =>
						axios
							.get(`/movie/fetch/${movieId}`)
							.then((res) => res.data.getMovie)
					);
					const rentMovieData = await Promise.all(movieRentPromises);
					setRentedMovies(rentMovieData);
				}

				if (user.boughtMovies) {
					const movieBuyPromises = user.boughtMovies.map((movieId) =>
						axios
							.get(`/movie/fetch/${movieId}`)
							.then((res) => res.data.getMovie)
					);
					const buyMovieData = await Promise.all(movieBuyPromises);
					setBoughtMovies(buyMovieData);
				}
			}
		}
		fetchMovies();
	}, [user]);

	const removeFriend = async (id) => {
		try {
			const response = await axios.post(
				`/user/removeFriend/${id}`,
				{},
				{
					headers: {
						Authorization: token,
					},
				}
			);
			console.log(response);
			setRefresh(true);
		} catch (error) {
			console.error(error.message);
		}
	};

	const removeMovie = async (tconst) => {
		try {
			const response = await axios.post(
				`/movie/remove_favourite/${tconst}`,
				{},
				{
					headers: {
						Authorization: token,
					},
				}
			);
			// Remove the deleted movie from the local movies state
			setFavMovies((prevState) =>
				prevState.map((movieArray) =>
					movieArray.filter((movie) => movie.tconst !== tconst)
				)
			);
			console.log(response.data.message);

			console.log(response.data.message);
		} catch (error) {
			console.error(error.message);
		}
	};

	const refundMovie = async (tconst) => {
		try {
			const response = await axios.post(
				`/movie/refundMovie/${tconst}`,
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

	const buyMovie = async (tconst) => {
		try {
			const response = await axios.post(
				`/movie/buyMovie/${tconst}`,
				{},
				{
					headers: {
						Authorization: token,
					},
				}
			);
			setRefresh(true);
			console.log(response.data);

			console.log(response.data.message);
		} catch (error) {
			alert(error.response.data.msg);
		}
	};

	const rentMovie = async (tconst) => {
		try {
			const response = await axios.post(
				`/movie/rentMovie/${tconst}`,
				{},
				{
					headers: {
						Authorization: token,
					},
				}
			);
			setRefresh(true);
			console.log(response.data);

			console.log(response.data.message);
		} catch (error) {
			alert(error.response.data.msg);
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
				<Clock />
				<div className="bg-blue-500 w-full h-32 flex justify-center items-center">
					{!profilePath ? (
						<img
							className="w-24 h-24 rounded-full border-4  border-white  mt-n16"
							src="https://via.placeholder.com/150"
							alt="Profile Picture"
						/>
					) : (
						<img
							className="object-cover w-24 h-24 rounded-full border-4  border-white"
							src={`http://localhost:4000/${profilePath}`}
							alt=""
						/>
					)}
				</div>
				<div className="grid grid-cols-3 gap-4 w-full mt-4 mx-4">
					<div className="col-span-2">
						{user ? (
							<div className="bg-white border border-gray-300 p-4 mx-2">
								<div className="text-xl font-bold mb-2">
									{user.firstName} {user.lastName}
								</div>
								<div className="mb-2">Wallet: {user.walletAmount}</div>
								<div className="mb-2">Bio: {user.bio}</div>
							</div>
						) : (
							<div className="bg-white border border-gray-300 p-4 mx-2">
								Loading user information...
							</div>
						)}
						<div className="bg-white border border-gray-300 p-4 mx-2 mt-4">
							<div className="text-xl font-bold mb-2">Purchased Movies</div>
							<div className="mb-2">
								{boughtMovies.length > 0 ? (
									<ul>
										{boughtMovies.map((movieArray, index) => (
											<div key={index}>
												<ul>
													{movieArray.map((movie, i) => (
														<li key={i}>
															<div className="movie-container flex flex-col">
																<div className="movie-title text-lg font-bold mb-2">
																	{movie.primaryTitle}
																</div>
																<div className="movie-details flex justify-between">
																	<div className="genres mb-2">
																		<span className="font-bold">Genres: </span>
																		{movie.genres}
																	</div>
																	<div className="title-type mb-2">
																		<span className="font-bold">
																			Movie type:{" "}
																		</span>
																		{movie.titleType}
																	</div>
																	<button
																		onClick={() => refundMovie(movie.tconst)}
																		class="bg-red-600 text-white py-2 px-4 rounded-md"
																	>
																		Refund
																	</button>
																</div>
															</div>
														</li>
													))}
												</ul>
											</div>
										))}
									</ul>
								) : boughtMovies.length === 0 ? (
									<div>No Movies Bought Yet</div>
								) : (
									<div>Loading Bought Movies...</div>
								)}
							</div>
						</div>
						<div className="bg-white border border-gray-300 p-4 mx-2 mt-4">
							<div className="text-xl font-bold mb-2">Rented Movies</div>
							<div className="mb-2">
								{rentedMovies.length > 0 ? (
									<ul>
										{rentedMovies.map((movieArray, index) => (
											<div key={index}>
												<ul>
													{movieArray.map((movie, i) => (
														<li key={i}>
															<div className="movie-container flex flex-col">
																<div className="movie-title text-lg font-bold mb-2">
																	{movie.primaryTitle}
																</div>
																<div className="movie-details flex justify-between">
																	<div className="genres mb-2">
																		<span className="font-bold">Genres: </span>
																		{movie.genres}
																	</div>
																	<div className="title-type mb-2">
																		<span className="font-bold">
																			Movie type:{" "}
																		</span>
																		{movie.titleType}
																	</div>
																	<button
																		onClick={() => refundMovie(movie.tconst)}
																		class="bg-red-600 text-white py-2 px-4 rounded-md"
																	>
																		Refund
																	</button>
																</div>
															</div>
														</li>
													))}
												</ul>
											</div>
										))}
									</ul>
								) : rentedMovies.length === 0 ? (
									<div>No Movies Rented Yet</div>
								) : (
									<div>Loading Rented Movies...</div>
								)}
							</div>
						</div>
					</div>

					<div className="col-span-1 w-full pr-4">
						<div className="bg-white border border-gray-300 p-4 mx-2 w-full">
							<div className="text-xl font-bold mb-2">Friends</div>
							<div className="flex flex-wrap">
								{console.log(localFriends)}
								{localFriends.map((friend) => {
									{
										console.log(friend);
									}
									const initials =
										friend.firstName && friend.lastName
											? friend.firstName.charAt(0) + friend.lastName.charAt(0)
											: "";
									return (
										<div className="relative">
											<img
												key={friend._id}
												className="w-12 h-12 rounded-full border-2 border-white mx-2 object-cover"
												src={
													`http://localhost:4000/${friend.profilePicture}` ||
													"https://via.placeholder.com/150"
												}
												alt={initials}
											/>
											<button
												onClick={() => removeFriend(friend._id)}
												className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 24 24"
													fill="currentColor"
													class="w-6 h-6"
												>
													<path
														fill-rule="evenodd"
														d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm3 10.5a.75.75 0 000-1.5H9a.75.75 0 000 1.5h6z"
														clip-rule="evenodd"
													/>
												</svg>
											</button>
										</div>
									);
								})}
							</div>
						</div>
						<div className="bg-white border border-gray-300 p-4  mx-2 mt-4 w-full ">
							<div className="text-xl font-bold mb-2">My Favourite Movies</div>
							{favMovies.length > 0 ? (
								<ul>
									{favMovies.map((movieArray, index) => (
										<div key={index}>
											<ul className="border-b-2 border-gray-300">
												{movieArray.map((movie, i) => (
													<li key={i} className="py-4">
														<div className="flex flex-wrap items-center">
															<p className="font-semibold text-lg">
																{movie.primaryTitle}
															</p>
															<div className="ml-auto">
																<button
																	className="px-4 py-2 bg-blue-500 text-white rounded-md mr-4 hover:bg-blue-600"
																	onClick={() => removeMovie(movie.tconst)}
																>
																	Remove
																</button>
																<button
																	className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2 hover:bg-blue-600"
																	onClick={() => buyMovie(movie.tconst)}
																>
																	Buy
																</button>
																<button
																	className="px-4 py-2 bg-blue-500 text-white rounded-md mt-1 hover:bg-blue-600"
																	onClick={() => rentMovie(movie.tconst)}
																>
																	Rent
																</button>
															</div>
														</div>
													</li>
												))}
											</ul>
										</div>
									))}
								</ul>
							) : rentedMovies.length === 0 ? (
								<div>no favourite movies yet</div>
							) : (
								<div>Loading favorite favMovies...</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default AccountPage;
