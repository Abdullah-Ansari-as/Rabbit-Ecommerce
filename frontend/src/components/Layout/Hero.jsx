import React from 'react'
import heroImage from "../../assets/rabbit-hero.webp"
import { Link } from 'react-router-dom'

const Hero = () => {
	return (
		<section>
			<img src={heroImage} alt="Rabbit" className='w-full h-[500px] md:h-[550px] object-cover' />
			<div className='absolute inset-0 bg-opacity-5 flex items-center justify-center mt-20'>
				<div className="text-center text-white p-6">
					<h1 className='text-6xl md:text-8xl font-bold tracking-tighter uppercase mb-4'>Vacation <br /> Ready</h1>
					<p className='text-sm tracking-tighter md:text-lg mb-6'>
						Explore our vacation-ready outfits with fast worldwide shipping.
					</p> 

					{/* <!-- From Uiverse.io by nathAd17 -->  */}
					<Link
						to="/collections/all"
						type="submit"
						className="flex justify-center w-40 md:w-44 cursor-pointer text-gray-900 gap-2 items-center mx-auto shadow-xl text-sm md:text-lg bg-gray-50 backdrop-blur-md lg:font-semibold isolation-auto border-gray-50 before:absolute  before:transition-all before:duration-700 before:-left-full before:hover:left-0 before:rounded-xl before:bg-emerald-500 hover:text-gray-950 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-4 py-1 overflow-hidden border-2 rounded-full group"
					>
						Shop Now
						<svg
							className="w-6 h-6 md:h-8 md:w-8 justify-end group-hover:rotate-90 group-hover:bg-gray-50 text-gray-50 ease-linear duration-300 rounded-full border border-gray-700 p-1 md:p-2 rotate-45"
							viewBox="0 0 16 19"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
								className="fill-gray-800 group-hover:fill-gray-800"
							></path>
						</svg>
					</Link>


				</div>
			</div>
		</section>
	)
}

export default Hero
