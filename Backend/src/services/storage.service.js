import { ImageKit } from "@imagekit/nodejs";
import config from "../config.js";

const client = new ImageKit({
  privateKey: config.IMAGEKIT_PRIVATE_KEY,
});

const uploadImage = async (buffer, fileName, sellerName) => {
  try {
    const response = await client.files.upload({
      file: buffer.toString("base64"),
      fileName: fileName,
      folder: `Threadora/${sellerName}/products/`,
    });
    return response.url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
};

export default uploadImage;