const express = require("express");
const Checkout = require("../models/checkout-model.js");
const Cart = require("../models/cart-model.js");
const Product = require("../models/product-model.js");
const Order = require("../models/order-model.js");
const { protect } = require("../middleware/auth-mid.js");

const router = express.Router();

router.post("/", protect, async (req, res) => {
	const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body;

	if (!checkoutItems || checkoutItems.length === 0) {
		return res.status(400).json({ message: "No Items in checkout!" })
	}

	try {
		// Create a new checkout session
		const newCheckout = await Checkout.create({
			user: req.user._id,
			checkoutItems: checkoutItems,
			shippingAddress,
			paymentMethod,
			totalPrice,
			paymentStatus: "Pending",
			isPaid: false,
		});

		// console.log(newCheckout);

		// console.log(`Checkout created for user: ${req.user._id}`);
		res.status(201).json(newCheckout);
	} catch (error) {
		console.log("Error Creating checkout session:", error);
		res.status(500).json({ message: "Failed to create a new checkout session" })
	}
});

router.put("/:id/pay", protect, async (req, res) => {
	const { paymentStatus, paymentDetails } = req.body;

	try {
		const checkout = await Checkout.findById(req.params.id);

		if (!checkout) {
			return res.status(404).json({ message: "Checkout not Found!" });
		}

		if (paymentStatus === "paid") {
			checkout.isPaid = true;
			checkout.paymentStatus = paymentStatus;
			checkout.paymentDetails = paymentDetails;
			checkout.paidAt = Date.now();
			await checkout.save();

			res.status(200).json(checkout);
		} else {
			res.status(400).json({ message: "Invalid Payment Status!" });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Payment Failed" });
	}
});

router.post("/:id/finalize", protect, async (req, res) => {
	try {
		const checkout = await Checkout.findById(req.params.id);
		if (!checkout) {
			return res.status(404).json({ message: "Checkout not Found!" })
		};

		if (checkout.isPaid && !checkout.isFinalized) {
			// Create final order based on checkout details
			const finalOrder = await Order.create({
				user: checkout.user,
				orderItems: checkout.checkoutItems,
				shippingAddress: checkout.shippingAddress,
				paymentMethod: checkout.paymentMethod,
				totalPrice: checkout.totalPrice,
				isPaid: true,
				paidAt: checkout.paidAt,
				isDelivered: false,
				paymentStatus: "paid",
				paymentDetails: checkout.paymentDetails
			});

			// Mark the checkout as finalized
			checkout.isFinalized = true;
			checkout.finalizedAt = Date.now();
			await checkout.save();

			// Delete the cart associated with the user
			await Cart.findOneAndDelete({ user: checkout.user });
			res.status(201).json(finalOrder);

		} else if (checkout.isFinalized) {
			res.status(400).json({message: "Checkout already Finalized!"});
		} else {
			return res.status(400).json({message: "Checkout is not paid"});
		}

	} catch (error) {
		console.log(error);
		res.status(500).json({message: "Failed to finalized checkout"});
	}
});



module.exports = router;