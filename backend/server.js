const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");
const userRoutes = require("./routes/user-routes.js")
const productsRoutes = require("./routes/product-routes.js")
const cartRoutes = require("./routes/cart-routes.js")
const checkoutRoutes = require("./routes/checkout-routes.js")
const orderRoutes = require("./routes/order-routes.js")
const uploadRoutes = require("./routes/uploads-routes.js")
const subscribeRoutes = require("./routes/subscriber-routes.js")
const adminRoutes = require("./routes/admin-routes.js")
const productAdminRoutes = require("./routes/productAdmin-routes.js")
const adminOrderRoutes = require("./routes/adminOrder-routes.js")
const stripeCheckout = require("./routes/stripe-routes.js")

const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();

const PORT = process.env.PORT || 3000;

// connect the db
connectDB();

app.get("/", (req, res) => {
	res.send("welcome to rabbit")
})

// API routes here
app.use("/api/users", userRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api", subscribeRoutes); 

// admin routes
app.use("/api/admin/users", adminRoutes);
app.use("/api/admin/products", productAdminRoutes);
app.use("/api/admin/orders", adminOrderRoutes);

// stripe route
app.use("/api", stripeCheckout)

app.listen(PORT, () => {
	console.log(`server is listening on port ${PORT}`)
})