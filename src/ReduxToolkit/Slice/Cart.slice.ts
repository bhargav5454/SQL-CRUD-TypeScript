import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import apiRequest from "../../Services/Api.service";
import toast from "react-hot-toast";

// Define the structure of a product
interface Product {
  id: number; // Product ID
  name: string; // Product name
  description: string; // Product description
  price: number; // Product price
}

// Define the structure of a cart item
interface CartItem {
  id: number; // Cart item ID
  product: Product; // Product details
  productId: number; // Associated product ID
  quantity: number; // Quantity of the product in the cart
  createdAt: string; // Timestamp of when the item was created
  createdBy: string; // User who created the cart item
  updatedAt: string; // Timestamp of when the item was last updated
}

// Define the structure of the cart state
interface Cart {
  cartItems: CartItem[]; // Array of cart items
  loading: boolean; // Loading state
  error: string | null; // Error state
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
    productId: number; // Required product ID
    quantity: number; // Required quantity
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
      return res.data; // Assuming this returns the full cart item
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for fetching cart items
export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (data: { endpoint: string }, { rejectWithValue }) => {
    try {
      const { endpoint } = data;
      const res = await apiRequest.get(endpoint);
      return res.data; // Assuming the response data is the cart items
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
        state.loading = true; // Set loading to true when adding an item
      })
      .addCase(
        addCartItem.fulfilled,
        (state, action: PayloadAction<{ data: CartItem }>) => {
          state.loading = false; // Set loading to false on success
          console.log("🚀 ~ action.payload.data:", action.payload.data)
          state.cartItems = [...state.cartItems, action.payload.data];// Add the new cart item
        }
      )
      .addCase(addCartItem.rejected, (state, action) => {
        state.loading = false; // Set loading to false on failure
        state.error = action.payload as string; // Store the error message
      })
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true; // Set loading to true when fetching items
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.loading = false; // Set loading to false on success
        state.cartItems = action.payload; // Replace cart items with fetched items
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false; // Set loading to false on failure
        state.error = action.payload as string; // Store the error message
      });
  },
});

// Export the reducer to be used in the store
export default cartSlice.reducer;
