const express = require("express");
const Order = require("../models/order-model.js");
const {protect} = require("../middleware/auth-mid.js");

const router = express.Router();

router.get("/my-orders", protect, async (req, res) => {
	try {
		// Find orders for authenticated user
		const orders = await Order.find({user: req.user._id}).sort({createdAt: -1}); // sort by most recent orders
		res.json(orders);

	} catch (error) {
		console.log(error);
		res.status(500).json({message: "Failed to find orders"});
	}
});

// fetch the latest order for order-conformation page
router.get("/fetchLastOrder", protect, async (req, res) => {
	try {
		const order = await Order.findOne().sort({createdAt: -1}).populate("user", "name");
		if(!order) {
			return res.status(404).json({message: "last order not found"});
		}
		res.status(200).json(order);
	} catch (error) {
		console.log(error);
		res.status(500).json({message: "Failed to find last order"});
	}
})

router.get("/:id", protect, async (req, res) => {
	try {
		const order = await Order.findById(req.params.id).populate("user", "name email");
		if(!order) {
			return res.status(404).json({message: "Order not found"});
		}

		// Return the full order details
		res.json(order);
	} catch (error) {
		console.log(error);
		res.status(500).json({message: "Failed to find order by id"});
	}
});

module.exports = router;