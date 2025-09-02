const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Token topilmadi" });
    }

    const token = authHeader.split(" ")[1];
    try {
        // token ichida { id: user._id } saqlanadi
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // { id: ... }
        next();
    } catch (err) {
        return res.status(401).json({ message: "Noto‘g‘ri token" });
    }
}

module.exports = authMiddleware;
