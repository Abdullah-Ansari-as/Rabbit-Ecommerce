import { Loader2 } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

const ProductGrid = ({products, loading, error}) => {
	if(loading) {
		return <div className='flex h-screen justify-center items-center'><Loader2 className=' h-12 w-12 animate-spin' /></div>
	}

	if(error) {
		return <p>Error: {error}</p>
	}
	// console.log(products)
	
  return (
	<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'> 
		{products.map((product) => (
			<Link key={product._id} to={`/product/${product._id}`} className='block'>
				<div className="bg-white p-4 rounded-lg">
					<div className="w-full h-96 mb-4">
						<img src={product.images[0]?.url} alt="alttext" className='w-full h-full object-cover rounded-lg'/>
					</div>
					<h3 className='text-sm mb-2'>{product.name}</h3>
					<p className='text-gray-500 font-medium text-sm tracking-tighter'>
						$ {product.price}
					</p>
				</div>
			</Link>
		))}
	</div>
  )
}

export default ProductGrid
