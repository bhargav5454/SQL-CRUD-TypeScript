import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import apiRequest from "../../Services/Api.service"
import toast from "react-hot-toast"

const initialState = {
    user: {
        data: [],
        isLoading: true,
        error: null
    },
    AuthToken: {
        token: null,
        userId: null
    }
}

export const handleSignupuser = createAsyncThunk('handleSignupuser',
    async (data, { rejectWithValue }) => {
        try {
            const { endpoint, payload } = data
            const res = await apiRequest.post(endpoint, payload)
            toast.success(res.data.message)
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);
        }

    }
)

export const handleLoginuser = createAsyncThunk('handleLogin',
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

const UserSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout: (state) => {
            state.user.data = []
            state.AuthToken.token = null
            state.AuthToken.userId = null
        }
    },
    extraReducers: (builder) => {
        builder.addCase(handleLoginuser.pending, (state, action) => {
            state.user.isLoading = true
            state.user.error = null
        })
        builder.addCase(handleLoginuser.fulfilled, (state, action) => {
            state.user.isLoading = false
            state.user.data = action.payload
            state.AuthToken.token = action.payload.token
            state.AuthToken.userId = action.payload.data.id
        })
        builder.addCase(handleLoginuser.rejected, (state, action) => {
            state.user.isLoading = false
            state.user.error = action.payload
        })
        builder.addCase(handleSignupuser.pending, (state, action) => {
            state.user.isLoading = true
            state.user.error = null
        })
        builder.addCase(handleSignupuser.fulfilled, (state, action) => {
            state.user.isLoading = false
            state.user.data = action.payload
        })
        builder.addCase(handleSignupuser.rejected, (state, action) => {
            state.user.isLoading = false
            state.user.error = action.payload
        })
    }
})

export const { logout } = UserSlice.actions;

export default UserSlice.reducer