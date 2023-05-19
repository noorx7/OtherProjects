import express from "express";
import { adminUserFetch, userFetch, walletAddAmount, profilePicture, usersSearchFetch, addFriend, removeFriend } from "../controller/userMethods.mjs";
import { walletAmountFetch } from "../controller/userMethods.mjs";
import { isLogged } from "../middleware/isLogged.mjs";
import { isAdmin } from "../middleware/isAdmin.mjs";
import { photoMiddleware } from "../middleware/multer.mjs";
import { multerErrorHandler } from "../middleware/multerErrorHandling.mjs";
const router = express.Router();


//Get a user's personal document  by ID
router.get("/getUser/:id", userFetch);

//Search for all users
router.post("/search", isLogged, usersSearchFetch);


// Get a user's wallet amount by ID
router.get("/getWalletAmount", isLogged, walletAmountFetch);


// Add Fund's to a User's Wallet 
router.post("/addWalletAmount", isLogged, walletAddAmount);


// Add A User's to a logged in User's Friends List 
router.post("/addFriend/:id", isLogged, addFriend);


// Remove A User's from a in User's Friends List 
router.post("/removeFriend/:id", isLogged, removeFriend);


//Set User's Profile Picture
router.post("/picture",
    isLogged,
    photoMiddleware.single('photo'),
    multerErrorHandler,
    profilePicture)


//Admin Controls
//Get a user's personal document  by as an Admin ID
router.get("/getUser_Admin", isLogged, isAdmin, adminUserFetch);

export default router;