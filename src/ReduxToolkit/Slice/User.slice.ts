import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import apiRequest from "../../Services/Api.service";
import toast from "react-hot-toast";

interface UserData {
  id: string;
  [key: string]: any; // Additional fields can be defined if needed
}

interface UserState {
  data: UserData[];
  isLoading: boolean;
  error: string | null;
}

interface AuthToken {
  token: string | null;
  userId: string | null;
}

interface InitialState {
  user: UserState;
  AuthToken: AuthToken;
}

interface AuthPayload {
  endpoint: string;
  payload: Record<string, any>;
}

const initialState: InitialState = {
  user: {
    data: [],
    isLoading: true,
    error: null,
  },
  AuthToken: {
    token: null,
    userId: null,
  },
};

export const handleSignupUser = createAsyncThunk<void, AuthPayload>(
  "handleSignupUser",
  async (data, { rejectWithValue }) => {
    try {
      const { endpoint, payload } = data;
      const res = await apiRequest.post(endpoint, payload);
      toast.success(res.data.message);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const handleLoginUser = createAsyncThunk(
  "handleLogin",
  async (data: AuthPayload, { rejectWithValue }) => {
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

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user.data = [];
      state.AuthToken.token = null;
      state.AuthToken.userId = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(handleLoginUser.pending, (state) => {
      state.user.isLoading = true;
      state.user.error = null;
    });
    builder.addCase(handleLoginUser.fulfilled, (state, action: PayloadAction<any>) => {
      state.user.isLoading = false;
      state.user.data = action.payload;
      state.AuthToken.token = action.payload.token;
      state.AuthToken.userId = action.payload.data.id;
    });
    builder.addCase(handleLoginUser.rejected, (state, action: PayloadAction<any>) => {
      state.user.isLoading = false;
      state.user.error = action.payload as string;
    });
    builder.addCase(handleSignupUser.pending, (state) => {
      state.user.isLoading = true;
      state.user.error = null;
    });
    builder.addCase(handleSignupUser.fulfilled, (state, action: PayloadAction<any>) => {
      state.user.isLoading = false;
      state.user.data = action.payload;
    });
    builder.addCase(handleSignupUser.rejected, (state, action: PayloadAction<any>) => {
      state.user.isLoading = false;
      state.user.error = action.payload as string;
    });
  },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;
