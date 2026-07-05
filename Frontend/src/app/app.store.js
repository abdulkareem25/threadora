import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/states/auth.slice";
import productReducer from "../features/products/states/product.slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
  },
});

export default store;