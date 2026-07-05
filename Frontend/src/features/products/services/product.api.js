import axios from 'axios';

const api = axios.create({
  baseURL: '/api/products',
  withCredentials: true,
});

/**
 * Get ImageKit authentication params for client-side upload.
 * Returns { token, expire, signature, publicKey, urlEndpoint }
 */
export const getImageKitAuth = async () => {
  try {
    const response = await api.get('/imagekit-auth');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

/**
 * Upload an image file directly to ImageKit from the browser.
 * @param {File} file - The image file to upload
 * @param {string} folder - The ImageKit folder path
 * @returns {Promise<string>} The uploaded image URL
 */
export const uploadImageToImageKit = async (file, folder = 'Threadora/products') => {
  const auth = await getImageKitAuth();

  const formData = new FormData();
  formData.append('file', file);
  formData.append('fileName', file.name);
  formData.append('folder', folder);
  formData.append('publicKey', auth.publicKey);
  formData.append('signature', auth.signature);
  formData.append('expire', auth.expire);
  formData.append('token', auth.token);

  const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'ImageKit upload failed');
  }

  const data = await response.json();
  return data.url;
};

/**
 * Create a new product. Images should already be uploaded to ImageKit.
 * @param {Object} productData - The product data including image URLs
 */
export const createProduct = async (productData) => {
  try {
    const response = await api.post('/', productData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

/**
 * Get all products for the authenticated seller.
 */
export const getSellerProducts = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};
