import express from "express";
import { deleteUser, login, profile, register, updateCredentials } from "../controller/authenticationMethods.mjs";
import { isLogged } from "../middleware/isLogged.mjs";
import { logout } from "../controller/authenticationMethods.mjs";

const router = express.Router();
//Registering a new User
router.post("/register", register)
//Logging in the User
router.post("/login", login);
//Fetching a User
router.get("/profile", isLogged, profile);
//Logging out the User
router.post("/logout", isLogged, logout);
//Deleting a User
router.delete("/delete", isLogged, deleteUser);
//Updating the User's credentials 
router.put("/update", isLogged, updateCredentials)

export default router;