import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = await loadStripe(
	"pk_test_51MvWECG4ey7MdPn7OPmE6FNrjDx7M9SRfiFKni2BHYAe9cYKyvJwtV2GdZ3zl07ftWazaEKfKcDbK2LQMI3XqDK100aSLEKlLb"
);
function UpdatePage() {
	const [newEmail, setNewEmail] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const { user, token, setUser, walletAmount } = useContext(UserContext);
	const [newWalletAmount, setNewWalletAmount] = useState(0);
	const [file, setFile] = useState(null);
	const [error, setError] = useState(null);
	const [refresh, setRefresh] = useState(false);

	function handleFileChange(event) {
		setFile(event.target.files[0]);
	}

	const handleEmailChange = (event) => {
		setNewEmail(event.target.value);
	};

	const handlePasswordChange = (event) => {
		setNewPassword(event.target.value);
	};

	const handleWalletChange = (event) => {
		setNewWalletAmount(event.target.value);
	};

	function handleSubmit(event) {
		event.preventDefault();

		const formData = new FormData();
		formData.append("photo", file);
		// replace with your own function to get the logged-in user's ID

		axios
			.post("/user/picture", formData, {
				headers: {
					Authorization: token,
				},
			})
			.then((response) => {
				console.log(response.data);
				setRefresh(true);
			})
			.catch((error) => {
				setError(error.response.data.error);
			});
	}

	const handleUpdateAccount = async () => {
		try {
			if (!newEmail || !newPassword) {
				alert("Please enter a new email and password.");
				return;
			}

			const response = await axios.put(
				"/auth/update",
				{
					newEmail,
					newPassword,
				},
				{
					headers: {
						Authorization: token,
					},
				}
			);
			setErrorMessage("");
			setUser(response.data.user);
			alert("Account Updated Successfully!");
		} catch (error) {
			console.log(error);
			setErrorMessage("Failed to update account information.");
		}
	};

	const handleAddFunds = async () => {
		try {
			const stripe = await stripePromise;
			const response = await axios.post(
				"/user/addWalletAmount",
				{
					amount: newWalletAmount * 100, // convert to cents
				},
				{
					headers: {
						Authorization: token,
					},
				}
			);
			const session = response.data;
			const result = await stripe.redirectToCheckout({
				sessionId: session.id,
			});
			if (result.error) {
				throw new Error(result.error.message);
			}
			alert("Funds added to wallet successfully!");

			setNewWalletAmount(0);
		} catch (error) {
			console.log(error);
			setErrorMessage("Failed to add funds to wallet.");
		}
	};

	if (!user) {
		return <div>Loading...</div>;
	}

	if (refresh) {
		setTimeout(() => {
			window.location.reload();
		}, 500); // wait for 1 second before refreshing the page
	}

	return (
		<div className="p-2 px-5">
			{/* Update Account Information */}
			<div className="border rounded-md mb-5 p-3">
				<h2 className="text-lg font-bold mb-3">Update Account Information</h2>
				<div className="mb-3">
					<label className="block mb-1" htmlFor="new-email">
						New Email:
					</label>
					<input
						className="border rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
						id="new-email"
						type="email"
						value={newEmail}
						onChange={handleEmailChange}
					/>
				</div>
				<div className="mb-3">
					<label className="block mb-1" htmlFor="new-password">
						New Password:
					</label>
					<input
						className="border rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
						id="new-password"
						type="password"
						value={newPassword}
						onChange={handlePasswordChange}
					/>
				</div>
				<button
					className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 mx-2"
					onClick={handleUpdateAccount}
				>
					Update Account
				</button>
			</div>

			{/* Wallet Amount */}
			<div className="border rounded-md mb-5 p-3">
				<h2 className="text-lg font-bold mb-3">Wallet Amount</h2>
				<div className="mb-3">
					<label className="block mb-1" htmlFor="wallet-amount">
						Wallet Amount:
					</label>
					<input
						className="border rounded-md py-2 px-3 w-full text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
						id="wallet-amount"
						type="text"
						onChange={handleWalletChange}
					/>
				</div>
				<button
					className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 mx-2"
					onClick={handleAddFunds}
				>
					Add Funds
				</button>
			</div>

			{/* Choose a Profile Picture */}
			<div className="border rounded-md p-3">
				<h2 className="text-lg font-bold mb-3">Choose a Profile Picture</h2>
				<form onSubmit={handleSubmit}>
					<div className="mb-3">
						<label className="block mb-1" htmlFor="photo">
							Choose a file:
						</label>
						<input
							type="file"
							id="photo"
							accept="image/*"
							onChange={handleFileChange}
						/>
					</div>
					{error && <div>{error}</div>}
					<button
						className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 mx-2"
						type="submit"
					>
						Upload
					</button>
				</form>
			</div>
		</div>
	);
}

export default UpdatePage;
