import jwt from "jsonwebtoken";
const secret = 'mysecretkey';
export const isLogged = async (req, res, next) => {
    try {
       
        let token = req.header("Authorization");
        console.log("Undecoded Token")
        console.log(token)

        if (!token) {
            return res.status(403).send("Access Denied");
        }
        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft();
        }

        const decoded = jwt.verify(token, secret);

        req.user = decoded;
        console.log("Decoded User")
        console.log(decoded)
        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
