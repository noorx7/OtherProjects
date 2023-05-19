import { createContext, useState, useEffect } from "react";
import axios from "axios";
export const UserContext = createContext({});

export function UserContextProvider({ children }) {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(localStorage.getItem("token"));
	const [movieData, setMovieData] = useState(null);
	const [favMovies, setFavMovies] = useState([]);
	const [favGenres, setFavGenres] = useState([]);
	const [boughtMovies, setBoughtMovies] = useState([]);
	const [walletAmount, setWalletAmount] = useState(0);
	const [profilePath, setProfilePath] = useState("");
	const [rentedMovies, setRentedMovies] = useState([]);
	const [searchFriendData, setSearchFriendData] = useState([]);
	const [friends, setFriends] = useState([]);
	console.log(favMovies);
	console.log(favGenres);
	console.log(walletAmount);
	console.log(profilePath);
	console.log(boughtMovies);
	console.log(rentedMovies);
	console.log(searchFriendData);
	console.log(friends);
	useEffect(() => {
		if (token && !user) {
			axios
				.get("/auth/profile", {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				.then(({ data }) => {
					setFavGenres(data.genre);
					setUser(data);
					setWalletAmount(data.walletAmount);
					setProfilePath(data.profilePicture);
					setFriends(data.friends);
				});
		}
	}, [user]);

	return (
		<UserContext.Provider
			value={{
				user,
				setUser,
				token,
				setToken,
				movieData,
				setMovieData,
				favMovies,
				setFavMovies,
				boughtMovies,
				setBoughtMovies,
				rentedMovies,
				setRentedMovies,
				favGenres,
				setFavGenres,
				walletAmount,
				setWalletAmount,
				profilePath,
				searchFriendData,
				setSearchFriendData,
				friends,
				setFriends,
			}}
		>
			{children}
		</UserContext.Provider>
	);
}
