const express = require("express");
const Product = require("../models/product-model.js");
const {protect, admin} = require("../middleware/auth-mid.js");

const router = express.Router();

router.get("/", protect, admin, async (req, res) => {
	try { 
		const products = await Product.find({});
		res.json(products);
	} catch (error) {
		console.log(error);
		res.status(500).json({message: "Failed to find all products!"});
	}
});



module.exports = router;