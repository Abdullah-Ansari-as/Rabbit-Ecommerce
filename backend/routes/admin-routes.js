const express = require("express");
const User = require("../models/user-model.js");
const {protect, admin} = require("../middleware/auth-mid.js");

const router = express.Router();

router.get("/", protect, admin, async (req, res) => {
	try {
		const users = await User.find({});
		res.json(users);
	} catch (error) {
		console.log(error);
		res.status(500).json({message: "Failed get all users for admin"});
	}
});

router.post("/", protect, admin, async (req, res) => {
	const {name, email, password, role} = req.body;
	try {

		let user = await User.findOne({email});

		if(user) {
			return res.status(400).json({message: "User already exists"})
		}

		user = new User({
			name,
			email,
			password,
			role: role || "customer"
		});

		await user.save();
		res.status(201).json({message: "User created successfully", user});

	} catch (error) {
		console.log(error);
		res.status(500).json({message: "Failed to create a new user"});
	}
});

router.put("/:id", protect, admin, async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if(user) {
			user.name = req.body.name || user.name;
			user.email = req.body.email || user.email;
			user.role = req.body.role || user.role;
		}
		const updatedUser = await user.save();
		res.json({message: "User updated successfully1", user: updatedUser});
	} catch (error) {
		console.log(error);
		res.status(500).json({message: "Failed to update the user!"});
	}
});

router.delete("/:id", protect, admin, async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if(user) {
			await user.deleteOne();
			res.status(200).json({message: "User deleted successfully"});
		} else {
			res.status(404).json({message: "User not found"});
		}
	} catch (error) {
		console.log(error)
		res.status(500).json({message: "failed to delete the user"})
	}
})

module.exports = router;