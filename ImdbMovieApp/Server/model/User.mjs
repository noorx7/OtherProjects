import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
        lastName: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
        email: {
            type: String,
            required: true,
            max: 50,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            min: 5,
        },
        favourite: {
            type: Array,
            default: [],
        },
        friends: {
            type: Array,
            default: [],
        },
        boughtMovies: {
            type: Array,
            default: [],
        },
        rentedMovies: {
            type: Array,
            default: [],
        },
        genre: {
            type: Array,
            default: [],
        },
        walletAmount: {
            type: Number,
            default: 0,
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        profilePicture: {
            type: String,
            default: ""
        }
    },
    { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
