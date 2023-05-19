import User from "../model/User.mjs";

export const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById({ _id: req.user.id });
        if (!user.isAdmin) {
            return res.status(401).send("Unauthorized");
        }
        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
