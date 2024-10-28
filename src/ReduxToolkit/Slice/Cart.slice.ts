import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import apiRequest from "../../Services/Api.service";
import toast from "react-hot-toast";

// Define the structure of a product
interface Product {
  id: number; 
  name: string; 
  description: string; 
  price: number; 
}

// Define the structure of a cart item
interface CartItem {
  id: number; 
  product: Product; 
  productId: number; 
  quantity: number; 
  createdAt: string; 
  createdBy: string; 
  updatedAt: string; 
}


interface Cart {
  cartItems: CartItem[]; 
  loading: boolean; 
  error: string | null; 
}

// Initial state for the cart
const initialState: Cart = {
  cartItems: [],
  loading: false,
  error: null,
};

// Payload type for adding cart items
interface AddCartItemPayload {
  endpoint: string;
  payload: {
    productId: number; 
    quantity: number; 
  };
}

// Async thunk for adding an item to the cart
export const addCartItem = createAsyncThunk(
  "cart/addCartItem",
  async (data: AddCartItemPayload, { rejectWithValue }) => {
    try {
      const { endpoint, payload } = data;
      const res = await apiRequest.post(endpoint, payload);
      toast.success(res.data.message);
      return res.data; 
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);


export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (data: { endpoint: string }, { rejectWithValue }) => {
    try {
      const { endpoint } = data;
      const res = await apiRequest.get(endpoint);
      return res.data; 
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Cart slice to manage cart state
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addCartItem.pending, (state) => {
        state.loading = true; 
      })
      .addCase(
        addCartItem.fulfilled,
        (state, action: PayloadAction<{ data: CartItem }>) => {
          state.loading = false; 
          console.log("🚀 ~ action.payload.data:", action.payload.data)
          state.cartItems = [...state.cartItems, action.payload.data];
        } 
      )
      .addCase(addCartItem.rejected, (state, action) => {
        state.loading = false; 
        state.error = action.payload as string; 
      })
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true; 
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.loading = false; 
        state.cartItems = action.payload; 
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false; 
        state.error = action.payload as string; 
      });
  },
});


export default cartSlice.reducer;
