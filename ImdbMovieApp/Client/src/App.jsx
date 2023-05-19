import { Route, Routes } from "react-router-dom";
import Layout from "./pages/Layout";
import axios from "axios";
import LoginPage from "./pages/LoginPage";
import AccountPage from "./pages/AccountPage";
import { UserContextProvider } from "./context/UserContext";
import RegisterPage from "./pages/RegisterPage";
import SearchPage from "./pages/SearchPage";
import UpdatePage from "./pages/UpdatePage";

axios.defaults.baseURL = "http://localhost:4000";
axios.defaults.withCredentials = true;

function App() {
	return (
		<div className="App">
			<UserContextProvider>
				<Routes>
					<Route path="/" element={<Layout />}>
						<Route index element={<SearchPage />} />
						<Route path="/login" element={<LoginPage />} />
						<Route path="/account" element={<AccountPage />} />
						<Route path="/update" element={<UpdatePage />} />
						<Route path="/register" element={<RegisterPage />} />
					</Route>
				</Routes>
			</UserContextProvider>
		</div>
	);
}

export default App;
