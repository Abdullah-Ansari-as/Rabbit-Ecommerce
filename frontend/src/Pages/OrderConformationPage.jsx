import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom'; 
import { clearCart } from '../redux/slices/cartSlice';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

const OrderConformationPage = () => {

	const dispatch = useDispatch();

	const [order, setOrder] = useState(null); 
	 
	useEffect(() => {
		try {
			const fetchLastOrder = async () => {
				const order = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/fetchLastOrder`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("userToken")}`
					}
				});
				// console.log(order.data);
				setOrder(order.data)
			}
			fetchLastOrder()
		} catch (error) {
			
		}
	}, [])

	useEffect(() => {
		dispatch(clearCart());
	}, [dispatch])

	if(!order) return <div className='flex items-center justify-center h-screen'><Loader2 className='w-14 h-14 animate-spin'/></div>

	return (
		<div className="min-h-screen flex items-center justify-center bg-blue-50 px-4 py-10">
			<div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 w-full max-w-3xl">
				<div className="flex flex-col items-center text-center">
					<div className="text-green-500 mb-4">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-16 w-16"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
						</svg>
					</div>
					<h1 className="text-3xl font-bold text-gray-800 mb-1">
						Thank You, {order?.user?.name}!
					</h1>
					<p className="text-gray-600 mb-6">
						Your order has been placed successfully. We appreciate your business.
					</p>
				</div>

				{/* Order Summary */}
				<div className="bg-gray-50 p-5 rounded-xl border border-gray-200 mb-6 text-sm sm:text-base">
					<p><strong className="text-gray-700">Order ID:</strong> {order?._id}</p>
					<p><strong className="text-gray-700">Total Price:</strong> ${order?.totalPrice.toFixed(2)}</p>
					<p><strong className="text-gray-700">Payment Method:</strong> {order?.paymentMethod}</p>
					<p><strong className="text-gray-700">Payment Status:</strong> {order?.paymentStatus}</p>
					<p><strong className="text-gray-700">Paid At:</strong> {new Date(order?.paidAt).toLocaleString()}</p>
					<p><strong className="text-gray-700">Delivery Status:</strong> {order?.isDelivered ? "Delivered" : "Pending"}</p>
				</div>

				{/* Shipping Address */}
				<div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
					<h2 className="text-lg font-semibold text-gray-800 mb-2">Shipping Address</h2>
					<p className="text-gray-700">{order?.shippingAddress.address}</p>
					<p className="text-gray-700">
						{order?.shippingAddress.city}, {order?.shippingAddress.country}
					</p>
				</div>

				{/* Ordered Items */}
				<div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
					<h2 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h2>
					{order?.orderItems.map((item, index) => (
						<div key={index} className="flex items-center justify-between mb-4">
							<div className="flex items-center gap-4">
								<img src={item.image} alt={item.name} className="w-14 h-14 rounded border object-cover bg-top" />
								<p className="text-gray-800 font-medium">{item.name}</p>
							</div>
							<div className="text-gray-600 text-sm">
								Qty: {item.quantity} | ${item.price.toFixed(2)}
							</div>
						</div>
					))}
				</div>

				{/* Button */}
				<div className="text-center">
					<Link
						to="/my-orders"
						className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition"
					>
						View My Orders
					</Link>
				</div>
			</div>
		</div>
	) 
}

export default OrderConformationPage
