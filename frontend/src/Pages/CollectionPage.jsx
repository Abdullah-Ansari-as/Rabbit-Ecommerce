import React, { useEffect, useRef, useState } from 'react'
import { FaFilter } from "react-icons/fa";
import FilterSidebar from '../components/Products/FilterSidebar';
import SortOptions from '../components/Products/SortOptions';
import ProductGrid from '../components/Products/ProductGrid';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByFilters } from "../redux/slices/productsSlice.js";

const CollectionPage = () => {

	const { collection } = useParams();
	const [searchParams] = useSearchParams();
 
	
	const dispatch = useDispatch();

	const { products, loading, error } = useSelector((state) => state.products);
	const queryParams = Object.fromEntries([...searchParams]); 
	const sidebarRef = useRef(null);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
	useEffect(() => {
		dispatch(fetchProductsByFilters({ collection, ...queryParams }));
	}, [dispatch, collection, searchParams]);

	const togglesidebar = () => {
		setIsSidebarOpen(!isSidebarOpen)
	}

	const handleClickOutside = (e) => {
		if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
			setIsSidebarOpen(false)
		}
	}

	useEffect(() => {
		// Add event listener for clicks
		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			// clean event listener
			document.removeEventListener("mousedown", handleClickOutside)
		};

	})


	return (
		<div className='flex flex-col lg:flex-row'>
			{/* Mobile Filter Button */}
			<button onClick={togglesidebar} className="lg:hidden border p-2 flex justify-center">
				<FaFilter />
			</button>
			<div ref={sidebarRef} className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 z-50 left-0 w-60 md:w-84 bg-white overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0`}>
				<FilterSidebar />
			</div>

			<div className="flex-grow p-4">
				<h2 className='text-2xl uppercase mb-4'>All Collections</h2>

				{/* Sort Options */}
				<SortOptions />

				{/* Product Grid */}
				{products.length > 0 ? (<ProductGrid products={products} loading={loading} error={error} />) : (<p className='text-md h-[80vh] flex items-center justify-center'>Products Not Found!</p>)}
				
			</div>
		</div>
	)
}

export default CollectionPage
