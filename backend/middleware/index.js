const jwt = require('jsonwebtoken')
const User = require('../model');  // Adjust the path if necessary

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(402).json({ message: "missing token" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.SECRET_KEY, async (err, decode) => {
        if (err) {
            return res.status(403).json({ message: "invalid Token" })
        }

        const user = await User.findOne({ _id: decode.id })

        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }

        req.user = user;
        next();
    })
};

module.exports = verifyToken;