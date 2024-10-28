import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "../Slice/User.slice";
import productReducer from "../Slice/Product.slice";
import CartReducer from "../Slice/Cart.slice";

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['AuthToken'], 
};

const persistedReducer = persistReducer(persistConfig, userReducer);

const reduxStore = configureStore({
    reducer: {
        user: persistedReducer,
        productData: productReducer,
        cartData: CartReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST'], // Ignore this specific action type
                ignoredPaths: ['register'], // Ignore the path where the non-serializable value is found
            },
        }),
});
export type RootState = ReturnType<typeof reduxStore.getState>;
export type AppDispatch = typeof reduxStore.dispatch;

export const persistor = persistStore(reduxStore);
export default reduxStore;
