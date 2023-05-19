import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/User.mjs";
const secret = 'mysecretkey';
import { tokenBlacklist } from "../blacklist.mjs"; // import the tokenBlacklist set
/* REGISTER USER */
export const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            favourite,
            walletAmount,
            isAdmin,
        } = req.body;

        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ msg: "Email address is already in use." });
        }

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            favourite,
            walletAmount,
            isAdmin,
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/* LOGGING IN */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) return res.status(400).json({ msg: "User does not exist. " });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

        const token = jwt.sign({ id: user._id }, secret);
        delete user.password;
        res.status(200).json({ token, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// GET A USER'S PROFILE
export const profile = async (req, res) => {
    const userId = req.user.id;

    if (userId) {
        const { firstName, lastName, email, favourite, genre, walletAmount, _id, profilePicture, boughtMovies, rentedMovies, friends } = await User.findById(userId)
        res.json({ firstName, lastName, email, favourite, genre, walletAmount, _id, profilePicture, boughtMovies, rentedMovies, friends })
        console.log({ firstName, lastName, email, favourite, genre, walletAmount, _id, profilePicture, boughtMovies, rentedMovies, friends })
    } else {
        res.json(null)
    }
}


/* LOGGING OUT */
export const logout = async (req, res) => {
    try {
        let token = req.header("Authorization");
        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft();
            if (token) {
                const decoded = jwt.decode(token, { complete: true });
                if (decoded) {
                    tokenBlacklist.add(decoded.header.jti); // add token to blacklist
                }
            }
            res.status(200).send('Logged out successfully');
        } else {
            res.status(401).send('Invalid token format');
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


/* UPDATING EMAIL/PASSWORD */
export const updateCredentials = async (req, res) => {
    try {
        const { newEmail, newPassword } = req.body;
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) return res.status(400).json({ msg: "Can't update, please log in." });

        const updates = {};
        if (newEmail) {
            // Check if another user with the new email address already exists
            const existingUser = await User.findOne({ email: newEmail });
            if (existingUser) {
                return res.status(400).json({ msg: "Email address is already in use." });
            }
            updates.email = newEmail;
        }
        if (newPassword) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            updates.password = hashedPassword;
        }

        if (Object.keys(updates).length > 0) {
            await User.findOneAndUpdate({ _id: userId }, { $set: updates });
            Object.assign(user, updates);
        }

        const token = jwt.sign({ id: user._id }, secret);
        delete user.password;
        res.status(200).json({ token, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



/* Delete a User */
export const deleteUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const deletedUser = await User.deleteOne({ _id: userId });

        if (deletedUser.deletedCount === 1) {
            res.status(200).json({ message: "User deleted successfully" });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};