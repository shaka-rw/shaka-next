import cloudinary from 'cloudinary';
import { configCloudinary } from './upload';

export const deleteCloudinaryAsset = async (assetPublicId: string) => {
  configCloudinary();
  const result = await cloudinary.v2.uploader.destroy(assetPublicId);
  return result;
};
