const express = require("express");
const Cart = require("../models/cart-model.js");
const Product = require("../models/product-model.js");
const { protect } = require("../middleware/auth-mid.js");

const router = express.Router();

// Helper function to get a cart by userId or guestId
const getCart = async (userId, guestId) => {
	if (userId) {
		return await Cart.findOne({ user: userId });
	} else if (guestId) {
		return await Cart.findOne({ guestId });
	}
	return null;
};

router.post("/", async (req, res) => {
	const { productId, quantity, size, color, guestId, userId } = req.body;
	try {
		const product = await Product.findById(productId);
		if (!product) return res.status(404).json({ message: "Product not Found!" });

		// Determine if the user is logged in or guest
		let cart = await getCart(userId, guestId);

		// if the cart exists, update it
		if (cart) {
			const productIndex = cart.products.findIndex(
				(p) =>
					p.productId.toString() === productId &&
					p.size === size &&
					p.color === color
			);

			if (productIndex > -1) {
				// if the product already exists, update the quantity
				cart.products[productIndex].quantity += quantity;
			} else {
				// add the new product
				cart.products.push({
					productId,
					name: product.name,
					image: product.images[0]?.url,
					price: product.price,
					size,
					color,
					quantity,
				})
			}

			// Recalculate the total price
			cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);

			await cart.save();

			return res.status(200).json(cart);
		} else {
			// Create a new cart for guest or user
			const newCart = await Cart.create({
				user: userId ? userId : undefined,
				guestId: guestId ? guestId : "guest_" + new Date().getTime(),
				products: [
					{
						productId,
						name: product.name,
						image: product.images[0]?.url,
						price: product.price,
						size,
						color,
						quantity,
					}
				],
				totalPrice: product.price * quantity
			});
			return res.status(201).json(newCart);
		}

	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Failed to adding a product into cart" });
	}
});

// ---> Same route upper wala (Made by me)
// const getCart = async (userId, guestId) => {
// 	try {
// 		if (userId) {
// 			return await Cart.findById({ user: userId });
// 		} else if (guestId) {
// 			return await Cart.findById(guestId);
// 		}
// 		return null;
// 	} catch (error) {
// 		console.log(error)
// 	}
// }
// router.post("/", async (req, res) => {
// 	const { productId, size, color, quantity, userId, guestId } = req.body;
// 	try {
// 		const product = await Product.findById(productId);
// 		if (!product) return res.status(404).json({ message: "Product not found!" });

// 		let cart = await getCart(userId, guestId);
// 		if (!cart) {
// 			const newCart = await Cart.create({
// 				user: userId ? userId : undefined,
// 				guestId: guestId || "guest_" + Date.now(),
// 				products: [
// 					{
// 						productId,
// 						name: product.name,
// 						image: product.images[0]?.url,
// 						price: product.price,
// 						size,
// 						color,
// 						quantity,
// 					}
// 				],
// 				totalPrice: product.price * quantity
// 			});

// 			return res.status(201).json(newCart)
// 		}

// 		const cartIndex = cart.products.findIndex((p) =>
// 			p.productId.toString() === productId.toString() &&
// 			p.size === size &&
// 			p.color === color
// 		);

// 		if(cartIndex > -1) {
// 			cart.products[cartIndex]?.quantity += quantity;
// 		} else {
// 			cart.products.push({
// 				productId,
// 				name: product.name,
// 				price: product.price,
// 				image: product.images[0].url,
// 				size,
// 				color,
// 				quantity
// 			});
// 		};

// 		cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);

// 		await cart.save();

// 		return res.status(201).json(cart);

// 	} catch (error) {
// 		console.log(error);
// 		res.status(500).json({message: "Failed to adding a product into cart"});
// 	}
// })

router.put("/", async (req, res) => {
	const { productId, quantity, size, color, guestId, userId } = req.body;
	try {
		let cart = await getCart(userId, guestId);
		if (!cart) return res.status(404).json({ message: "Cart not Found!" });
		const productIndex = cart.products.findIndex((p) => p.productId.toString() === productId && p.size === size && p.color === color);
		if (productIndex > -1) {
			if (quantity > 0) {
				cart.products[productIndex].quantity = quantity;
			} else {
				cart.products.splice(productIndex, 1) // remove the product if quantity is 0
			}

			cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
			await cart.save();
			return res.status(200).json(cart);

		} else {
			return res.status(404).json({ message: "Product not Found!" });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Failed to update a product!" });
	};
});

router.delete("/", async (req, res) => {
	const { productId, size, color, guestId, userId } = req.body;
	try {
		let cart = await getCart(userId, guestId);
		if (!cart) return res.status(404).json({ message: "Cart not found!" });

		const productIndex = cart.products.findIndex((p) =>
			p.productId.toString() === productId &&
			p.size === size &&
			p.color === color
		);

		if (productIndex > -1) {
			cart.products.splice(productIndex, 1);

			cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);

			await cart.save();
			return res.status(200).json(cart);
		} else {
			return res.status(404).json({ message: "Product not Found!" });
		}

	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Failed to delte the item to cart!" });
	}
});

router.get("/", async (req, res) => {
	const { userId, guestId } = req.query;
	try {
		const cart = await getCart(userId, guestId);

		if (cart) {
			res.json(cart);
		} else {
			res.status(404).json({ message: "cart not found!" });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Failed to get cart!" });
	}
});

router.post("/merge", protect, async (req, res) => {
	const { guestId } = req.body;
	try {
		// Find the guest cart and user cart
		const guestCart = await Cart.findOne({ guestId });
		const userCart = await Cart.findOne({ user: req.user._id });

		if (guestCart) {
			if (guestCart.products.length === 0) {
				return res.status(400).json({ message: "Guest cart is empty!" });
			}

			if (userCart) {
				// Merge guest Cart into User Cart
				guestCart.products.forEach((guestItem) => {
					const productIndex = userCart.products.findIndex((item) =>
						item.productId.toString() === guestItem.productId.toString() &&
						item.size === guestItem.size &&
						item.color === guestItem.color
					);

					if (productIndex > -1) {
						// If the items exists in the user Cart, update the quatity
						userCart.products[productIndex].quantity += guestItem.quantity;
					} else {
						// OterWise, add the guest item to the cart
						userCart.products.push(guestItem);
					}
				});

				userCart.totalPrice = userCart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
				await userCart.save();

				// Remove the guest Cart after merging
				try {
					await Cart.findOneAndDelete({ guestId });
				} catch (error) {
					console.log("Error deleting guest cart", error);
				}
				res.status(200).json(userCart);
			} else {
				// if the user has no existing cart, assign the guest cart to the user
				guestCart.user = req.user._id;
				guestCart.guestId = undefined;
				await guestCart.save();

				res.status(200).json(guestCart);
			}
		} else {
			if (userCart) {
				// Guest cart has already been merged, return the user Cart
				return res.status(200).json(userCart)
			}
			res.status(404).json({ message: "Guest Cart not found!" });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Failed to merging a guest user's shopping cart with a logged-in user's cart" });
	}
});

module.exports = router;