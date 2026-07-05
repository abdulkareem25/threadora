import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setLoading,
  setUploadingImages,
  setError,
  setSuccess,
  setProducts,
  removeProduct,
  updateProductInList,
  resetProductState,
} from '../states/product.slice';
import {
  createProduct,
  getSellerProducts,
  uploadImageToImageKit,
  updateProduct,
  deleteProduct,
} from '../services/product.api';

const useProduct = () => {
  const dispatch = useDispatch();
  const productState = useSelector((s) => s.product);
  // Counter to track concurrent uploads so uploadingImages is only cleared
  // once all concurrent uploads finish.
  const uploadCount = useRef(0);

  /**
   * Upload a single image file to ImageKit.
   * @param {File} file
   * @param {string} [folder]
   * @returns {Promise<string>} ImageKit URL
   */
  const uploadImage = async (file, folder = 'Threadora/products') => {
    uploadCount.current += 1;
    dispatch(setUploadingImages(true));
    try {
      const url = await uploadImageToImageKit(file, folder);
      return url;
    } catch (error) {
      dispatch(setError(error.message || 'Image upload failed'));
      throw error;
    } finally {
      uploadCount.current -= 1;
      if (uploadCount.current === 0) {
        dispatch(setUploadingImages(false));
      }
    }
  };

  /**
   * Submit the complete product to the backend (images already uploaded).
   * @param {Object} productData
   * @returns {boolean} true on success
   */
  const addProduct = async (productData) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      await createProduct(productData);
      dispatch(setSuccess(true));
      return true;
    } catch (error) {
      dispatch(setError(error.message || 'Failed to create product'));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };

  /**
   * Fetch all products for the authenticated seller.
   */
  const fetchProducts = async () => {
    dispatch(setLoading(true));
    try {
      const data = await getSellerProducts();
      dispatch(setProducts(data.products));
    } catch (error) {
      dispatch(setError(error.message || 'Failed to fetch products'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  /**
   * Optimistically update a product in the list, rolling back on API failure.
   * @param {string} id - Product _id
   * @param {Object} data - Partial product fields to update
   * @returns {{ success: boolean, error?: string }}
   */
  const editProduct = async (id, data) => {
    // Take a snapshot of the current product for rollback
    const snapshot = productState.products.find((p) => p._id === id);
    // Optimistic update — merge data into snapshot
    if (snapshot) {
      dispatch(updateProductInList({ ...snapshot, ...data }));
    }
    try {
      const res = await updateProduct(id, data);
      // Replace optimistic copy with the server-canonical version
      dispatch(updateProductInList(res.product));
      return { success: true };
    } catch (error) {
      // Roll back if server rejected the update
      if (snapshot) dispatch(updateProductInList(snapshot));
      const msg = error.message || 'Failed to update product';
      dispatch(setError(msg));
      return { success: false, error: msg };
    }
  };

  /**
   * Optimistically remove a product from the list, rolling back on API failure.
   * @param {string} id - Product _id
   * @returns {{ success: boolean, error?: string }}
   */
  const destroyProduct = async (id) => {
    // Take a snapshot of the current products list for rollback
    const snapshot = [...productState.products];
    dispatch(removeProduct(id));
    try {
      await deleteProduct(id);
      return { success: true };
    } catch (error) {
      // Roll back the optimistic delete
      dispatch(setProducts(snapshot));
      const msg = error.message || 'Failed to delete product';
      dispatch(setError(msg));
      return { success: false, error: msg };
    }
  };

  const reset = () => dispatch(resetProductState());

  return {
    ...productState,
    uploadImage,
    addProduct,
    fetchProducts,
    editProduct,
    destroyProduct,
    reset,
  };
};

export default useProduct;

