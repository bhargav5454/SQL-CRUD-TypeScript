import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import apiRequest from "../../Services/Api.service";
import toast from "react-hot-toast";

// Define the types for the product and the slice's state
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
}

interface ProductState {
  product: Product[];
  loading: boolean;
  error: any | null;
}

const initialState: ProductState = {
  product: [],
  loading: false,
  error: null,
};

interface AddProductData {
  endpoint: string;
  payload: Omit<Product, "id">;
}

interface FetchProductData {
  endpoint: string;
}

interface DeleteProductData {
  endpoint: string;
  productId: string;
}

interface UpdateProductData {
  endpoint: string;
  productId: string;
  payload: Partial<Product>;
}

// Async thunks
export const addproduct = createAsyncThunk(
  "addproduct",
  async (data: AddProductData, { rejectWithValue }) => {
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

export const fetchProduct = createAsyncThunk(
  "fetchProduct",
  async (data: FetchProductData, { rejectWithValue }) => {
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

export const deleteProduct = createAsyncThunk(
  "deleteProduct",
  async (data: DeleteProductData, { rejectWithValue }) => {
    try {
      const { endpoint, productId } = data;
      const res = await apiRequest.delete(`${endpoint}/${productId}`);
      toast.success(res.data.message);
      return res.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "updateProduct",
  async (data: UpdateProductData, { rejectWithValue }) => {
    try {
      const { endpoint, productId, payload } = data;
      const res = await apiRequest.put(`${endpoint}/${productId}`, payload);
      toast.success(res.data.message);
      return res.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Product slice
const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addproduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addproduct.fulfilled,
        (state, action: PayloadAction<{ data: Product }>) => {
          state.loading = false;
          state.product = state.product.concat(action.payload.data);
        }
      )
      .addCase(addproduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProduct.fulfilled,
        (state, action: PayloadAction<{ data: Product[] }>) => {
          state.loading = false;
          state.product = action.payload.data;
        }
      )
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteProduct.fulfilled,
        (state, action: PayloadAction<{ data: Product }>) => {
          state.loading = false;
          state.product = state.product.filter(
            (product) => product.id !== action.payload.data.id
          );
        }
      )
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateProduct.fulfilled,
        (state, action: PayloadAction<{ data: Product }>) => {
          state.loading = false;
          const updatedProduct = action.payload.data;
          state.product = state.product.map((product) =>
            product.id === updatedProduct.id ? updatedProduct : product
          );
        }
      )
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default productSlice.reducer;
