const jwt = require("jsonwebtoken");
const User = require("../models/user-model.js");

// Middleware to protect routes
const protect = async (req, res, next) => {
	let token; 
	if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
		try {
			token = req.headers.authorization.split(" ")[1];
			// console.log(token);
			
			if (!token) {
				return res.status(401).json({ message: "No token, authorization denied" });
			}

			const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

			req.user = await User.findById(decode.user.id).select("-password");
			next();

		} catch (error) {
			console.log("toke varification failed", error);
			res.status(401).json({ message: "Not Authorized, Token Failed!" });
		}
	} else {
		res.status(401).json({ message: "Not authorized, no token provided" });
	}
};

// Middleware to check if the user is an admin
const admin = (req, res, next) => {
	// console.log(req.user)
	if (req.user && req.user.role === "admin") {
		next();
	} else {
		res.status(403).json({ message: "Not authorized as an admin!" })
	}
}

module.exports = { protect, admin };