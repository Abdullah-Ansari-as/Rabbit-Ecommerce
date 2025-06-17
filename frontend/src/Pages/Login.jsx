import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import login from "../assets/login.webp";
import { loginUser } from '../redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { mergeCart } from '../redux/slices/cartSlice';
import {toast} from "sonner";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
 
	
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const {user, guestd, loading} = useSelector((state) => state.auth);
	const {cart} = useSelector((state) => state.cart);

	// console.log(user);

	// Get redirect parameter and check if it's checkout or something
	const redirect = new URLSearchParams(location.search).get("redirect") || "/";
	const isCheckoutRedirect = redirect.includes("checkout");

	useEffect(() => {
		if(user) {
			if(cart?.products.length > 0 && guestd) {
				dispatch(mergeCart({guestd, user})).then(() => {
					navigate(isCheckoutRedirect ? "/checkout" : "/");
				});
			} else {
				navigate(isCheckoutRedirect ? "/checkout" : "/");
			}
		}
	}, [user, guestd, cart, navigate, isCheckoutRedirect, dispatch]);


	const onHandleSubmit = async (e) => {
		e.preventDefault();
		// console.log({name, email, password})
		const result = await dispatch(loginUser({email, password}));

		// console.log(result)
		if(result.error) {
			toast.error(result.payload.message); 
		}
 
	}

  return (
	<div className='flex'>
	  <div className="w-full md:w-1/2 flex flex-col items-center p-6 md:p-12">
	  	<form onSubmit={onHandleSubmit} className="w-full max-w-sm bg-white p-4 md:p-8 rounded-lg border shadow-sm">
			<div className="flex justify-center mb-6">
				<h2 className='text-xl font-medium'>Rabbit</h2>
			</div>
			<h2 className='text-2xl font-bold text-center mb-6'>
				Hey there! 👋🏻
			</h2>
			<p className='text-center text-sm mb-6'>
				Enter your Username or Password to Login
			</p>
			<div className="mb-4">
				<label className='block text-sm font-semibold mb-2'>Email</label>
				<input 
					type="email" 
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder='Enter your email address'
					className='w-full p-2 border rounded'
				/>
			</div>
			<div className="mb-4">
				<label className='block text-sm font-semibold mb-2'>Password</label>
				<input 
					type="password" 
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder='Enter your password'
					className='w-full p-2 border rounded'
				/>
			</div>

			<button type='submit' disabled={loading} className='w-full bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800 cursor-pointer transition'>
				{ loading ? "Loading..." : "Login"}
			</button>
			<p className="mt-6 text-center text-sm">
				Don't have an account? <Link to={`/register?redirect=${encodeURIComponent(redirect)}`} className='text-blue-500'>Register</Link>
			</p>
		</form>
	  </div>

	  <div className="hidden md:block w-1/2">
		<div className="h-full flex flex-col justify-center items-center">
			<img src={login} alt="login_img" className='h-[570px] w-full object-cover'/>
		</div>
	  </div>
	</div>
  )
}

export default Login
