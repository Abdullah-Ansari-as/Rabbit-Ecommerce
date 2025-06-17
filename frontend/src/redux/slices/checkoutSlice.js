import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async Thunk to create checkout session
export const createCheckout = createAsyncThunk("checkout/createCheckout", async (checkoutData, { rejectwithValue }) => {
	try {
		const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/checkout`, checkoutData, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("userToken")}`,
			},
		});
		// console.log(response);
		return response.data;
	} catch (error) {
		return rejectwithValue(error.response.data);
	}
});

const checkoutSclice = createSlice({
	name: "checkout",
	initialState: {
		checkout: null,
		loading: false,
		error: null
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(createCheckout.pending, (state) => {
				state.loading = true;
				state.error = null
			})
			.addCase(createCheckout.fulfilled, (state, action) => {
				state.loading = false;
				state.checkout = action.payload;
			})
			.addCase(createCheckout.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload.message;
			})
	}
});

export default checkoutSclice.reducer;