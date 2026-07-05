import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setLoading,
  setUploadingImages,
  setError,
  setSuccess,
  setProducts,
  resetProductState,
} from '../states/product.slice';
import {
  createProduct,
  getSellerProducts,
  uploadImageToImageKit,
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

  const reset = () => dispatch(resetProductState());

  return {
    ...productState,
    uploadImage,
    addProduct,
    fetchProducts,
    reset,
  };
};

export default useProduct;
