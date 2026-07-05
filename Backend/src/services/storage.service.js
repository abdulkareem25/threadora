import { ImageKit } from "@imagekit/nodejs";
import config from "../config/config.js";

const client = new ImageKit({
  privateKey: config.IMAGEKIT_PRIVATE_KEY,
  publicKey: config.IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: config.IMAGEKIT_URL_ENDPOINT,
});

/**
 * Upload a file buffer to ImageKit (server-side, if needed in the future).
 */
export const uploadImage = async (buffer, fileName, folder) => {
  try {
    const response = await client.files.upload({
      file: buffer.toString("base64"),
      fileName: fileName,
      folder: folder || "Threadora/products",
    });
    return response.url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
};

/**
 * Generate authentication parameters for ImageKit client-side uploads.
 * The frontend calls GET /api/products/imagekit-auth to get these params,
 * then uploads images directly to ImageKit without routing through the server.
 *
 * @returns {{ token, expire, signature, publicKey, urlEndpoint }}
 */
export const getImageKitAuthParams = () => {
  try {
    // getAuthenticationParameters lives on client.helper in SDK v7+
    const authParams = client.helper.getAuthenticationParameters();
    return {
      ...authParams,
      publicKey: config.IMAGEKIT_PUBLIC_KEY,
      urlEndpoint: config.IMAGEKIT_URL_ENDPOINT,
    };
  } catch (error) {
    console.error("Error generating ImageKit auth params:", error);
    throw new Error("Failed to generate upload authentication");
  }
};

export default uploadImage;