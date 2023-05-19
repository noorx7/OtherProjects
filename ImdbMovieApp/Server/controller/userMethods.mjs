import User from "../model/User.mjs";
import stripe from "stripe";
import multer from 'multer';
import fs from "fs"
const stripeClient = stripe("sk_test_51MvWECG4ey7MdPn7BG08Gtt0AFJIo5RaQ1PuoSJN8JzyaydRgHMr6lWqCCV4otnNMk8fa6z7cm3wFDoH2lGml9l000XsXQMvF1");


/* Get a user's profile */
export const userFetch = async (req, res) => {
    try {

        const friendId = req.params.id;
        const getUser = await User.findOne({ _id: friendId });
        if (getUser == null) {
            return res.status(400).json({ msg: `User with ID ${friendId} does not exist.` });
        } else {
            const { _id, profilePicture, firstName, lastName } = getUser;
            return res.status(200).json({ user: { _id, profilePicture, firstName, lastName } });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal server error" });
    }
};


// Search for users
export const usersSearchFetch = async (req, res) => {
    try {
        const firstName = req.body.firstName;
        console.log(firstName)
        const regex = new RegExp(firstName, 'i');
        let query = { firstName: regex };

        const getUsers = await User.find(query).limit(10);

        // Return 10 instances of the match
        const userMatch = getUsers.find(user => user.firstName === firstName);
        if (userMatch) {
            getUsers.splice(getUsers.indexOf(userMatch), 1);
            getUsers.unshift(userMatch);
        }

        return res.status(200).json({ users: getUsers });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal server error" });
    }
};

/* Admin access on user's profile */
export const adminUserFetch = async (req, res) => {
    try {

        const id = req.body.id;
        const getUser = await User.findOne({ _id: id });
        if (getUser == null) {
            return res.status(400).json({ msg: `User with ID ${id} does not exist.` });
        } else {
            return res.status(200).json({ msg: `User with name ${getUser.firstName} ${getUser.lastName} ID is: ${getUser._id}` });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal server error" });
    }
};

export const walletAmountFetch = async (req, res) => {

    try {

        const id = req.user.id;
        const getUser = await User.findOne({ _id: id });

        if (getUser == null) {
            return res.status(400).json({ msg: ` User with  ${id} does not exist.` });
        }
        else {
            return res.status(200).json({ msg: `User with name ${getUser.firstName} ${getUser.lastName} wallet amount is: ${getUser.walletAmount} ` });
        }
    }

    catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal server error" });
    }

}

/* Add Fund's on my Wallet */
export const walletAddAmount = async (req, res) => {
    try {

        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) return res.status(400).json({ msg: "Can't update, please log in." });

        const { amount } = req.body;
        const session = await stripeClient.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "cad",
                        product_data: {
                            name: "Add funds to wallet",
                        },
                        unit_amount: amount,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: "http://localhost:5173/account",
            cancel_url: "http://localhost:5173/",
        });

        // Update user's wallet amount with the added funds
        user.walletAmount += amount / 100;
        await user.save();

        res.json({ id: session.id });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to create checkout session." });
    }
}







/* Add Profile Picture */
export const profilePicture = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    if (req.file.size > 1000000) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: 'File too large. Please upload a file below 1MB' });
    }

    const { path: filePath } = req.file;
    const userId = req.user.id;
    User.findByIdAndUpdate(userId, { profilePicture: filePath }, { new: true })
        .then(user => {
            if (!user) {
                fs.unlinkSync(filePath);
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        })
        .catch(error => {
            console.error('Error saving profile picture to user:', error);
            fs.unlinkSync(filePath);
            res.status(500).json({ error: 'An error occurred while saving the profile picture to the user' });
        });
}


//Add a friend 
export const addFriend = async (req, res) => {
    try {
        const friendId = req.params.id;
        const userId = req.user.id;
        console.log(friendId)
        console.log(userId)

        // Check if the friend is already in the user's friends list
        const user = await User.findById(userId);
        if (user.friends.includes(friendId)) {
            return res.status(400).json({ msg: "User is already a friend." });
        }

        // Add the friend to the user's friends list and save the updated user object
        user.friends.push(friendId);
        await user.save();

        res.status(200).json({ msg: "User added to friends list.", user: user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal server error" });
    }
};



export const removeFriend = async (req, res) => {
    try {
        const friendId = req.params.id;
        const userId = req.user.id;

        // Check if the friend is not in the user's friends list
        const user = await User.findById(userId);
        if (!user.friends.includes(friendId)) {
            return res.status(400).json({ msg: "User is not a friend." });
        }

        // Remove the friend from the user's friends list and save the updated user object
        user.friends = user.friends.filter((friend) => friend !== friendId);
        await user.save();

        res.status(200).json({ msg: "User removed from friends list.", user: user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal server error" });
    }
};

