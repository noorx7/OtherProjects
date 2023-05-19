import { Link, Navigate } from "react-router-dom";
import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUser, setToken } = useContext(UserContext);

  async function handleLoginSubmit(ev) {
    ev.preventDefault();
    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }
    try {
      const { data } = await axios.post("/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", data.token);
      console.log(data);
      setUser(data);
      alert("Login successful");
      setRedirect(true);
    } catch (e) {
      console.log(e);
      if (e.response && e.response.data && e.response.data.error) {
        alert(e.response.data.error);
      } else if (e.response && e.response.status === 422) {
        alert("Password is wrong");
      } else {
        alert("Login failed. Please try again later.");
      }
    }
  }

  if (redirect) {
    setTimeout(() => {
      window.location.reload();
    }, 1000); // wait for 1 second before refreshing the page
    return <Navigate to={"/"} />;
  }

  return (
    <div
      className="mt-2 grow flex items-center justify-around"
      style={{
        backgroundColor: "#F0F2F5",
        border: "1px solid #DADDE1",
        color: "#1C1E21",
      }}
    >
      <div>
        <h1 className="text-4xl text-center mb-4">Log in to Hardworking Ants</h1>
        <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #DADDE1",
              borderRadius: "4px",
              color: "#1C1E21",
              padding: "12px",
              width: "100%",
            }}
          />
          <input
            type="password"
			placeholder="Password"
			value={password}
			onChange={(ev) => setPassword(ev.target.value)}
			style={{
			backgroundColor: "#FFFFFF",
			border: "1px solid #DADDE1",
			borderRadius: "4px",
			color: "#1C1E21",
			padding: "12px",
			width: "100%",
			}}
			/>
			<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "12px" }}>
			<div>
			<input type="checkbox" id="keep-me-logged-in" style={{ marginRight: "8px" }} />
			<label htmlFor="keep-me-logged-in" style={{ color: "#1C1E21", fontSize: "14px" }}>Keep me signed in</label>
			</div>
			<div>
			<a href="/" style={{ color: "#1877F2", fontSize: "14px", textDecoration: "none" }}>Forgotten password?</a>
			</div>
			</div>
			<button style={{
			backgroundColor: "#1877F2",
			borderRadius: "4px",
			border: "none",
			color: "#FFFFFF",
			fontSize: "16px",
			fontWeight: "bold",
			padding: "12px",
			width: "100%",
			marginTop: "16px"
			}}>Sign In</button>
			<div style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "#1C1E21" }}>
			<span>New to Hardworking Ants? </span>
			<a href="/register" style={{ color: "#1877F2", marginLeft: "8px", textDecoration: "none" }}>Sign Up</a>
			</div>
			</form>
			</div>
			</div>
			);
			}
			
			export default LoginPage;