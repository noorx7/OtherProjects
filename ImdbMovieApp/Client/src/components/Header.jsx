import React, { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import UpdatePage from "../pages/UpdatePage";
function Header() {
	const [showMenu, setShowMenu] = useState(false);
	const toggleMenu = () => setShowMenu(!showMenu);
	const {
		user,
		token,
		setUser,
		setToken,
		movieData,
		setMovieData,
		profilePath,
		searchFriendData,
		setSearchFriendData,
	} = useContext(UserContext);
	const [redirect, setRedirect] = useState(false);
	const [movieName, setMovieName] = useState("");
	const [friendName, setFriendName] = useState("");
	const [isMoviesSearch, setIsMoviesSearch] = useState(false);

	const handleSearch = async () => {
		try {
			const response = await axios.post(`movie/fetch`, {
				name: movieName,
			});
			setMovieData(response.data.getMovie);
		} catch (error) {
			console.log(error);
		}
	};

	const handleFriendSearch = async () => {
		try {
			const response = await axios.post(
				`/user/search`,
				{
					firstName: friendName,
				},
				{
					headers: {
						Authorization: token,
					},
				}
			);
			const users = response.data.users;
			console.log(response.data.users);
			setSearchFriendData(users);
		} catch (error) {
			console.log(error);
		}
	};

	function handleLogout() {
		axios
			.post(
				"/auth/logout",
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			.then(() => {
				setUser(null);
				localStorage.removeItem("token");
				setToken(null);
				alert("Logout successful");
				setRedirect(true);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	function toggleSearch() {
		setIsMoviesSearch(!isMoviesSearch);
	}

	if (redirect) {
		setTimeout(() => {
			window.location.reload();
		}, 500); // wait for 1 second before refreshing the page
		return <Navigate to={"/"} />;
	}

	return (
		<header>
			<div className="flex items-center justify-between">
				<Link
					to={"/"}
					onClick={() => {
						setMovieData(null);
						setSearchFriendData(null);
					}}
				>
					<div className="flex items-center gap-1 mx-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-6 h-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0112 12.75zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 01-1.152 6.06M12 12.75c-2.883 0-5.647.508-8.208 1.44.125 2.104.52 4.136 1.153 6.06M12 12.75a2.25 2.25 0 002.248-2.354M12 12.75a2.25 2.25 0 01-2.248-2.354M12 8.25c.995 0 1.971-.08 2.922-.236.403-.066.74-.358.795-.762a3.778 3.778 0 00-.399-2.25M12 8.25c-.995 0-1.97-.08-2.922-.236-.402-.066-.74-.358-.795-.762a3.734 3.734 0 01.4-2.253M12 8.25a2.25 2.25 0 00-2.248 2.146M12 8.25a2.25 2.25 0 012.248 2.146M8.683 5a6.032 6.032 0 01-1.155-1.002c.07-.63.27-1.222.574-1.747m.581 2.749A3.75 3.75 0 0115.318 5m0 0c.427-.283.815-.62 1.155-.999a4.471 4.471 0 00-.575-1.752M4.921 6a24.048 24.048 0 00-.392 3.314c1.668.546 3.416.914 5.223 1.082M19.08 6c.205 1.08.337 2.187.392 3.314a23.882 23.882 0 01-5.223 1.082"
							/>
						</svg>
						<span className="font-bold text-xl px-1">HardWorking Ants </span>
					</div>
					<div></div>
				</Link>
				<div className="pe-10">
					<div className="flex items-center gap-2 border border-gray-300 rounded-full p-3 px-4 shadow-md shadow-gray-300">
						<button onClick={toggleSearch}>
							{/* Switcher ICON BELOW */}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="w-6 h-6"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"
								/>
							</svg>
						</button>
						{isMoviesSearch ? (
							<>
								<div>Search Movie</div>
								<input
									placeholder="Enter a Movie name.."
									className="px-2 border border-spacing-0.5 border-gray-900"
									type="text"
									value={movieName}
									onChange={(e) => setMovieName(e.target.value)}
								/>
								<button
									className="bg-primary text-white p-1 rounded-full"
									onClick={handleSearch}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="#000"
										class="w-6 h-6"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
										/>
									</svg>
								</button>
							</>
						) : (
							<>
								<div>Search Friend</div>
								<input
									placeholder="Enter first name.."
									className="px-2 border border-spacing-0.5 border-gray-900"
									type="text"
									value={friendName}
									onChange={(e) => setFriendName(e.target.value)}
								/>
								<button
									className="bg-primary text-white p-1 rounded-full"
									onClick={handleFriendSearch}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="#000"
										class="w-6 h-6"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
										/>
									</svg>
								</button>
							</>
						)}
					</div>
				</div>
				<div className="flex items-center gap-2 border border-gray-300 rounded-full p-2 px-4">
					<div className="relative flex">
						{user && (
							<button className="focus:outline-none" onClick={toggleMenu}>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={1.5}
									className="w-6 h-6"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
									/>
								</svg>
							</button>
						)}
						{!user && <p>Login Here</p>}
						{showMenu && (
							<div className="absolute top-0 right-0 mt-10 mr-2 py-1 px-10 bg-white rounded shadow-lg">
								<button className="flex items-center" onClick={handleLogout}>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										class="w-8 h-8"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
										/>
									</svg>

									<span class="ml-2 whitespace-nowrap">Log Out</span>
								</button>

								<Link className="mt-2 flex items-center" to="/update">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										class="w-6 h-6"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
										/>
									</svg>

									<span class="ml-2 whitespace-nowrap">Update Profile</span>
								</Link>
							</div>
						)}
					</div>
					<Link
						to={user ? "/account" : "/login"}
						className="bg-gray-500 text-white rounded-full border border-gray-500 overflow-hidden"
					>
						{!profilePath ? (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								className="w-6 h-6 relative top-1"
							>
								<path
									fillRule="evenodd"
									d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
									clipRule="evenodd"
								/>
							</svg>
						) : (
							<img
								className="w-6 h-6 relative object-cover "
								src={`http://localhost:4000/${profilePath}`}
								alt=""
							/>
						)}
					</Link>
					{!!user && <div>{`${user.firstName}  ${user.lastName}`}</div>}
				</div>
			</div>
		</header>
	);
}

export default Header;
