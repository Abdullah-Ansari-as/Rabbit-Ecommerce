import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createCheckout } from "../../redux/slices/checkoutSlice"
import axios from 'axios';
import { FaStripe } from 'react-icons/fa';
import { loadStripe } from '@stripe/stripe-js'; 


const Checkout = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { cart, loading, error } = useSelector((state) => state.cart);
	const { user } = useSelector((state) => state.auth);

	const {checkout} = useSelector((state) => state.checkout);
	// console.log(checkout)

	// console.log(cart)

	const [checkoutId, setCheckoutId] = useState(null);
	// console.log(checkoutId)

	const [shippingAddress, setShippingAddress] = useState({
		firstName: "",
		lastName: "",
		address: "",
		city: "",
		postalCode: "",
		country: "",
		phone: ""
	});

	if(checkout && checkout._id) {
		localStorage.setItem("latestCheckout", JSON.stringify(checkout));
	}

	// Ensure cart is not loaded before proceeding
	useEffect(() => {
		if (!cart || !cart.products || cart.products.length === 0) {
			navigate("/")
		}
	}, [cart, navigate]);

	const handleCreateCheckout = async (e) => {
		e.preventDefault();
		if (cart && cart.products.length > 0) {
			const res = await dispatch(createCheckout({
				checkoutItems: cart.products,
				shippingAddress,
				paymentMethod: "Stripe",
				totalPrice: cart.totalPrice
			}));
			// console.log(res)
			if (res.payload && res.payload._id) {
				setCheckoutId(res.payload._id); // set checkout id if checkout was successful
			}
		}
	};

	const makePayment = async () => {

		const stripe = await loadStripe("pk_test_51REtisRqDFNW3YxnENmt3kifxIM27QCfe3WdFvdRAikJzWU0LV2CFG3zU6ppND7TeJFcxMap8gQNpylukOZ2AoSq00H2xRAbGk");

		const body = {
			products: cart.products
		}

		const headers = {
			"Content-Type": "application/json"
		}

		const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/create-checkout-session`, {
			method: "POST",
			headers: headers,
			body: JSON.stringify(body)
		})
		const session = await response.json();
		const result = stripe.redirectToCheckout({
			sessionId: session.id
		})

		if (result.error) {
			console.log(result.error);
		}
	}

	const handlePaymentSuccess = async (details) => {
		// console.log(details)
		try {
			const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`, { paymentStatus: "paid", paymentDetails: details }, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("userToken")}`
				}
			});

			await handleFinalizeCheckout(checkoutId); // Finalize checkout if payment is successful

		} catch (error) {
			console.error(error)
		};
	};

	const handleFinalizeCheckout = async (checkoutId) => {
		try {
			const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`, {}, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("userToken")}`
				},
			});

			navigate("/order-conformation");

		} catch (error) {
			console.error(error)
		}
	};

	if (loading) {
		return <div className='flex h-screen justify-center items-center'><Loader2 className=' h-12 w-12 animate-spin' /></div>
	}

	if (error) {
		return <p>Error: {error}</p>
	}

	if (!cart || !cart.products || cart.products.length === 0) {
		return <p>Your cart is empty</p>
	}

	return (
		<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter'>
			{/* Left Section */}
			<div className="bg-white rounded-lg p-6">
				<h2 className="text-2xl uppercase mb-6">checkout</h2>
				<form onSubmit={handleCreateCheckout}>
					<h3 className="text-lg mb-4">Contact Details</h3>
					<div className="mb-4">
						<label className='block text-gray-700'>Email</label>
						<input
							type="email"
							value={user ? user.email : ""}
							className='w-full border rounded p-2'
							disabled
						/>
					</div>
					<h3 className="text-lg mb-4">Delivery</h3>
					<div className="mb-4 grid grid-cols-2 gap-4">
						<div>
							<label htmlFor="" className='block text-gray-700'>First Name</label>
							<input
								type="text"
								className='w-full p-2 border rounded'
								value={shippingAddress.firstName}
								onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
								required
							/>
						</div>
						<div>
							<label htmlFor="" className='block text-gray-700'>Last Name</label>
							<input
								type="text"
								className='w-full p-2 border rounded'
								value={shippingAddress.lastName}
								onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
								required
							/>
						</div>
					</div>
					<div className="mb-4">
						<label className='block text-gray-700'>Address</label>
						<input
							type="text"
							value={shippingAddress.address}
							onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
							className='w-full p-4 border rounded'
							required
						/>
					</div>
					<div className="mb-4 grid grid-cols-2 gap-4">
						<div>
							<label htmlFor="" className='block text-gray-700'>city</label>
							<input
								type="text"
								className='w-full p-2 border rounded'
								value={shippingAddress.city}
								onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
								required
							/>
						</div>
						<div>
							<label htmlFor="" className='block text-gray-700'>Postal Code</label>
							<input
								type="text"
								className='w-full p-2 border rounded'
								value={shippingAddress.postalCode}
								onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
								required
							/>
						</div>
					</div>
					<div className="mb-4">
						<label className='block text-gray-700'>Country</label>
						<input
							type="text"
							value={shippingAddress.country}
							onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
							className='w-full p-4 border rounded'
							required
						/>
					</div>
					<div className="mb-4">
						<label className='block text-gray-700'>Phone</label>
						<input
							type="tel"
							value={shippingAddress.phone}
							onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
							className='w-full p-4 border rounded'
							required
						/>
					</div>
					<div className="mt-6">
						{
							!checkoutId ? (
								<button type="submit" className='bg-black text-white w-full py-3 rounded cursor-pointer'>Continue to payment</button>
							) : (
								<div>
									<h3 className="text-lg mb-4">Pay with Stripe</h3>
									{/* stripe component */}
									<button onClick={() => { handlePaymentSuccess(), makePayment() }} className='bg-blue-500 w-full rounded-2xl hover:bg-blue-600 cursor-pointer'>
										<FaStripe className='w-14 h-14 mx-auto' />
									</button>
								</div>
							)
						}
					</div>
				</form>
			</div>
			{/* Right section */}
			<div className="bg-gray-50 p-6 rounded-lg">
				<h3 className="text-lg mb-4">Order Summary</h3>
				<div className="border-t py-4 mb-4">
					{cart?.products.map((product, idx) => {
						return (
							<div className="flex items-start justify-between py-2 border-b" key={idx}>
								<div className="flex items-start">
									<img src={product.image} alt={product.name} className='w-20 h-24 object-cover mr-4' />
									<div>
										<h3 className="text-md">{product.name}</h3>
										<div className="text-gray-500">Size: {product.size}</div>
										<div className="text-gray-500">Color: {product.color}</div>
									</div>
									<p className='text-xl ml-2'>${product.price?.toLocaleString()}</p>
								</div>
							</div>
						)
					})}
				</div>
				<div className="flex justify-between items-center text-lg mb-4">
					<p>Subtotal</p>
					<p>${cart.totalPrice?.toLocaleString()}</p>
				</div>
				<div className='flex justify-between items-center text-lg'>
					<p>Shipping</p>
					<p>Free</p>
				</div>
				<div className="flex justify-between items-center text-lg mt-4 border-t pt-4">
					<p>Total</p>
					<p>${cart.totalPrice.toLocaleString()}</p>
				</div>
			</div>
		</div>
	)
}

export default Checkout
