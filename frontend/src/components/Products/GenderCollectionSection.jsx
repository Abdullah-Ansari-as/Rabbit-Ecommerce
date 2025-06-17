import React from 'react'
import mensCollectionimg from "../../assets/mens-collection.webp"
import womensCollectionimg from "../../assets/womens-collection.webp"
import { Link } from 'react-router-dom'

const GenderCollectionSection = () => {
	return (
		<section className='max-w-6xl mx-auto py-16 px-4 lg:px-0'>
			<div className="container mx-auto flex flex-col md:flex-row gap-8">
				{/* Womens Collection */}
				<div className="relative flex-1">
					<img
						src={womensCollectionimg}
						alt="women's collection"
						className='w-full h-[700px] object-cover bg-top'
					/>
					<div className='bottom-8 left-8  w-68  p-4 absolute bg-white/70 rounded-md z-10 overflow-hidden group'>
						<h2 className='text-2xl font-bold text-gray-900 mb-3'> Women's Collection</h2>
						<Link to="/collections/all?gender=Women" className="text-gray-900 underline">Shop Now</Link>
						<span className="absolute bottom-0 left-5 h-1 w-1 bg-white/90 rounded-md transition-all duration-900 transform translate-y-full scale-0 group-hover:scale-[300] group-hover:translate-y-0 z-[-1]"></span>
					</div> 

				</div>

				{/* mens Collection */}
				<div className="relative flex-1">
					<img
						src={mensCollectionimg}
						alt="women's collection"
						className='w-full h-[700px] object-cover'
					/>
					<div className='bottom-8 left-8  w-68  p-4 absolute bg-white/70 rounded-md z-10 overflow-hidden group'>
						<h2 className='text-2xl font-bold text-gray-900 mb-3'>Men's Collection</h2>
						<Link to="/collections/all?gender=Men" className="text-gray-900 underline">Shop Now</Link>
						<span className="absolute bottom-0 left-5 h-1 w-1 bg-white/90 rounded-md transition-all duration-900 transform translate-y-full scale-0 group-hover:scale-[300] group-hover:translate-y-0 z-[-1]"></span>
					</div>
				</div>

			</div>
		</section>
	)
}

export default GenderCollectionSection
