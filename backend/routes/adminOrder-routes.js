const express = require("express");
const Order = require("../models/order-model.js");
const { protect, admin } = require("../middleware/auth-mid.js");

const router = express.Router();

router.get("/", protect, admin, async (req, res) => {
	try {
		const order = await Order.find({}).populate("user", "name email");
		res.json(order);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Failed to get order" })
	}
});

router.put("/:id", protect, admin, async (req, res) => {
	try {
		const order = await Order.findById(req.params.id).populate("user", "name");
		if (order) {
			order.status = req.body.status || order.status;
			order.isDelivered = req.body.status === "Delivered" ? true : order.isDelivered;
			order.deliveredAt = req.body.status === "Devivered" ? Date.now() : order.deliveredAt;

			const updatedOrder = await order.save();
			res.json(updatedOrder);
		} else {
			res.status(404).json({ message: "Order not found!" })
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Failed to update order status" })
	}
});

router.delete("/:id", protect, admin, async (req, res) => {
	try {
		const order = await Order.findById(req.params.id);
		if (order) {
			await order.deleteOne();
			res.json({ message: "Order Romoved" });
		} else {
			res.status(404).json({message: "Order not found"});
		}
	} catch (error) {
		concole.log(error);
		res.status(500).json({message: "Failed to remove order"})
	}
})

module.exports = router;