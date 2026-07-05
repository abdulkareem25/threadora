import { createSlice } from '@reduxjs/toolkit';

const productSlice = createSlice({
  name: 'product',
  initialState: {
    loading: false,
    uploadingImages: false,
    error: null,
    success: false,
    products: [],
  },
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setUploadingImages(state, action) {
      state.uploadingImages = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setSuccess(state, action) {
      state.success = action.payload;
    },
    setProducts(state, action) {
      state.products = action.payload;
    },
    /** Optimistically remove a product from the list by its MongoDB _id */
    removeProduct(state, action) {
      state.products = state.products.filter((p) => p._id !== action.payload);
    },
    /** Optimistically replace a single product in the list after an update */
    updateProductInList(state, action) {
      const updated = action.payload;
      state.products = state.products.map((p) =>
        p._id === updated._id ? updated : p
      );
    },
    resetProductState(state) {
      state.loading = false;
      state.uploadingImages = false;
      state.error = null;
      state.success = false;
    },
  },
});

export const {
  setLoading,
  setUploadingImages,
  setError,
  setSuccess,
  setProducts,
  removeProduct,
  updateProductInList,
  resetProductState,
} = productSlice.actions;

export default productSlice.reducer;

