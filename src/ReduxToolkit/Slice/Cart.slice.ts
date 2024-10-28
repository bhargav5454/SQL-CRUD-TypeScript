import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import apiRequest from "../../Services/Api.service";
import toast from "react-hot-toast";

interface Cart_items {
  productId: string;
  quantity: number;
  price: number;
}

interface Cart {
  cartItems: Cart_items[];
  totalPrice: number;
  loading: boolean;
  error: any | null;
}

const initialState: Cart = {
  cartItems: [],
  totalPrice: 0,
  loading: false,
  error: null,
};

interface AddCartItem {
  endpoint: string;
  payload: Omit<Cart_items, "price">;
}

interface fetchCartItems {
  endpoint: string;
}

export const AddCartItem = createAsyncThunk(
  "cart/addCartItem",
  async (data: AddCartItem, { rejectWithValue }) => {
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
  async (data: fetchCartItems, { rejectWithValue }) => {
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

const CartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(AddCartItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        AddCartItem.fulfilled,
        (state, action: PayloadAction<Cart_items>) => {
          state.loading = false;
          state.cartItems = [...state.cartItems, action.payload];
          state.totalPrice += action.payload.quantity * action.payload.price;
        }
      )
      .addCase(AddCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as any;
      })
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
        state.totalPrice = state.cartItems.reduce(
          (total, item) => total + item.quantity * item.price,
          0
        );
      })
      .addCase(fetchCartItems.rejected,(state,action)=>{
        state.loading = false;
        state.error = action.payload as any;    
      })
  },
});

export default CartSlice.reducer