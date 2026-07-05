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
  resetProductState,
} = productSlice.actions;

export default productSlice.reducer;
