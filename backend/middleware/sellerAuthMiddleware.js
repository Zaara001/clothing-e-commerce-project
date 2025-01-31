const jwt = require('jsonwebtoken')
const Seller = require('../model/sellerSchema')  // Adjust the path if necessary

const VerifySeller = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(402).json({ message: "missing token" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.SECRET_KEY, async (err, decode) => {
        if (err) {
            return res.status(403).json({ message: "invalid Token" })
        }

        const Sellers = await Seller.findOne({ _id: decode.id })

        if (!Sellers) {
            return res.status(404).json({ message: "user not found" })
        }

        req.Sellers = Sellers;
        next();
    })
};

module.exports = VerifySeller;