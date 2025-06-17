import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProductsDetails, updateProduct } from '../../redux/slices/productsSlice';
import { Loader2 } from 'lucide-react';
import axios from 'axios';

const EditProductPage = () => {

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const{id} = useParams();

	// console.log(id)

	const {selectedProduct, loading, error}= useSelector((state) => state.products);

	// console.log(selectedProduct);

	const [productData, setProductData] = useState({
		name: "",
		description: "",
		price: 0,
		countInStock: 0,
		sku: "",
		category: "",
		brand: "",
		sizes: [],
		colors: [],
		collections: "",
		material: "",
		gender: "",
		images: []
	});

	const [uploading, setUploading] = useState(false);

	useEffect(() => {
		if(id) {
			dispatch(fetchProductsDetails(id));
		}
	}, [dispatch, id]);

	useEffect(() => {
		if(selectedProduct) {
			setProductData(selectedProduct);
		}
	}, [selectedProduct])

	const handleChange = (e) => {
		setProductData((prevData) => ({
			...prevData,
			[e.target.name]: e.target.value
		}));
	};

	const handleImageUpload = async (e) => {
		const file = e.target.files[0];
		// console.log(file)
		const formData = new FormData();
		formData.append("image", file);

		try {
			setUploading(true);
			const {data} = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/upload`, formData, {
				headers: {
					"Content-Type": "multipart/form-data"
				}
			});

			setProductData((prevData) => ({
				...prevData,
				images: [...prevData.images, {url: data.imageUrl, altText: ""}],
			}));

			setUploading(false);
		} catch (error) {
			console.error(error);
			setUploading(false);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// console.log(productData);
		dispatch(updateProduct({id, productData}));
		navigate("/admin/products")
	};

	if(loading) return <div className='flex h-[80vh] justify-center items-center'><Loader2 className=' h-12 w-12 animate-spin' /></div>
	if(error) return <p>Error: {error}</p>

	return (
		<div className='max-w-5xl mx-auto p-3 md:p-6 shadow-md rounded-md'>
			<h2 className="text-3xl font-bold mb-6">Edit product</h2>
			<form onSubmit={handleSubmit}>
				{/* Name */}
				<div className="mb-6">
					<label className='block font-semibold mb-2'>Product Name</label>
					<input
						type="text"
						name='name'
						value={productData.name}
						onChange={handleChange}
						className='w-full border border-gray-300 rounded-md p-2'
						required
					/>
				</div>
				{/* Description */}
				<div className="mb-6">
					<label className='block font-semibold mb-2'>Description</label>
					<textarea
						name='description'
						value={productData.description}
						onChange={handleChange}
						className='w-full border border-gray-300 rounded-md p-2'
						rows={4}
						required
					/>
				</div>
				{/* Price input */}
				<div className="mb-6">
					<label className='block font-semibold mb-2'>Price</label>
					<input
						type="number"
						name='price'
						value={productData.price}
						onChange={handleChange}
						className='w-full border border-gray-300 rounded-md p-2'
					/>
				</div>
				{/* Count in Stock */}
				<div className="mb-6">
					<label className='block font-semibold mb-2'>Count in Stock</label>
					<input
						type="number"
						name='countInStock'
						value={productData.countInStock}
						onChange={handleChange}
						className='w-full border border-gray-300 rounded-md p-2'
					/>
				</div>
				{/* Sku */}
				<div className="mb-6">
					<label className='block font-semibold mb-2'>SKU</label>
					<input
						type="text"
						name='sku'
						value={productData.sku}
						onChange={handleChange}
						className='w-full border border-gray-300 rounded-md p-2'
					/>
				</div>
				{/* Sizes */}
				<div className="mb-6">
					<label className='block font-semibold mb-2'>Sizes (comma-separated)</label>
					<input
						type="text"
						name='sizes'
						value={productData.sizes.join(", ")}
						onChange={(e) => setProductData({ ...productData, sizes: e.target.value.split(",").map((size) => size.trim()) })}
						className='w-full border border-gray-300 rounded-md p-2'
					/>
				</div>
				{/* Colors */}
				<div className="mb-6">
					<label className='block font-semibold mb-2'>Colors (comma-separated)</label>
					<input
						type="text"
						name='colors'
						value={productData.colors.join(", ")}
						onChange={(e) => setProductData({ ...productData, colors: e.target.value.split(",").map((color) => color.trim()) })}
						className='w-full border border-gray-300 rounded-md p-2'
					/>
				</div>

				{/* Image upload */}
				<div className="mb-6">
					<label className='block font-semibold mb-2'>Upload Image</label>
					<input
						type="file"
						onChange={handleImageUpload}
						className='bg-gray-200 w-60 p-4 rounded-lg cursor-pointer sm:w-auto'
					/>
					{uploading && <p>Uploading image...</p>}
					<div className="flex gap-4 mt-4">
						{productData.images.map((image, index) => (
							<div key={index} className="">
								<img src={image.url} alt={image.altText || "Product Image"}
									className='w-20 h-20 object-cover rounded-md shadow-md'
								/>
							</div>
						))}
					</div>
				</div>

				<button type='submit' className='w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 cursor-pointer transition-colors'>
					Upload Product
				</button>

			</form>
		</div>
	)
}

export default EditProductPage
