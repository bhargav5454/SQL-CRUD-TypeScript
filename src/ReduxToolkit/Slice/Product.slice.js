import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiRequest from "../../Services/Api.service";
import toast from "react-hot-toast";

const initialState = {
    product: [],
    loading: false,
    error: null,
}

export const addproduct = createAsyncThunk('addproduct',
    async (data, { rejectWithValue }) => {
        try {
            const { endpoint, payload } = data
            const res = await apiRequest.post(endpoint, payload)
            toast.success(res.data.message)
            return res.data
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
)

export const fetchProduct = createAsyncThunk('fetchProduct',
    async (data, { rejectWithValue }) => {
        try {
            const { endpoint } = data;
            const res = await apiRequest.get(endpoint)
            return res.data
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
)

export const deleteProduct = createAsyncThunk('deleteProduct',
    async (data, { rejectWithValue }) => {
        try {
            const { endpoint, productId } = data
            const res = await apiRequest.delete(`${endpoint}/${productId}`)
            toast.success(res.data.message)
            return res.data
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);
        }
    })

export const updateProduct = createAsyncThunk('updateProduct',
    async (data, { rejectWithValue }) => {
        try {
            const { endpoint, productId, payload } = data
            const res = await apiRequest.put(`${endpoint}/${productId}`, payload)
            toast.success(res.data.message)
            return res.data
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);
        }
    })

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(addproduct.pending, (state, action) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(addproduct.fulfilled, (state, action) => {
            state.loading = false;
            state.product = state.product.concat(action.payload.data);
        });
        builder.addCase(addproduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        builder.addCase(fetchProduct.pending, (state, action) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(fetchProduct.fulfilled, (state, action) => {
            state.loading = false;
            state.product = action.payload.data;
        })
        builder.addCase(fetchProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        builder.addCase(deleteProduct.pending, (state, action) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(deleteProduct.fulfilled, (state, action) => {
            state.loading = false;
            state.product = state.product.filter(product => product.id !== action.payload.data.id);
        })
        builder.addCase(deleteProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        builder.addCase(updateProduct.pending, (state, action) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(updateProduct.fulfilled, (state, action) => {
            state.loading = false;
            const updatedProduct = action.payload.data;
            state.product = state.product.map(product =>
                product.id === updatedProduct.id ? updatedProduct : product
            );
        });
        
        builder.addCase(updateProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
    }
})

export default productSlice.reducer;