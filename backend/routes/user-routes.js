const express = require("express");
const User = require("../models/user-model.js");
const jwt = require("jsonwebtoken");
const {protect} = require("../middleware/auth-mid.js")

const router = express.Router();

router.post("/register", async (req, res) => {
	const { name, email, password } = req.body;

	try {
		let user = await User.findOne({ email });

		if (user) {
			return res.status(400).json({
				message: "User already exists!"
			})
		}

		user = new User({ name, email, password });
		await user.save();


		// Creating jwt Payload
		const payload = { user: { id: user._id, role: user.role } };

		// Sign and return the token along with user data
		jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "40h" }, (err, token) => {
			if (err) throw err;

			// send the user and token in response
			res.status(201).json({
				user: {
					_id: user._id,
					name: user.name,
					email: user.email,
					role: user.role
				},
				token,
			})
		});

	} catch (error) {
		console.log(error)
		res.status(500).send("Error while register");
	}
});

router.post("/login", async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ message: "Invalid Credentials" });
		};

		const isMatchPassword = await user.matchPassword(password);
		if (!isMatchPassword) return res.status(400).json({ message: "Invalid Credentials" });

		// Creating jwt Payload
		const payload = { user: { id: user._id, role: user.role } };

		// Sign and return the token along with user data
		jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "40h" }, (err, token) => {
			if (err) throw err;

			// send the user and token in response
			res.json({
				user: {
					_id: user._id,
					name: user.name,
					email: user.email,
					role: user.role
				},
				token,
			})
		});

	} catch (error) {
		console.log(error);
		res.status(500).send("Error while Login");
	}
});

router.get("/profile", protect, async (req,res) => {
	res.json(req.user)
})

module.exports = router;