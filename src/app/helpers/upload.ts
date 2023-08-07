import { existsSync } from 'fs';
import { mkdir, unlink, writeFile } from 'fs/promises';
import path from 'path';
import cloudinary from 'cloudinary';

export const uploadLocal = async (lFiles: File[]) => {
  const result = lFiles.map(async (f) => {
    const tempPath =
      process.cwd() +
      `/images_temp/${Math.random().toString().replace('.', '_')}_` +
      f.name;
    const exists = existsSync(path.dirname(tempPath));

    if (!exists) await mkdir(path.dirname(tempPath));

    await writeFile(tempPath, Buffer.from(await f.arrayBuffer()));
    return tempPath;
  });
  return Promise.all(result);
};

export const uploadToCloudinary = (localPath: string, remoteFolder: string) => {
  return cloudinary.v2.uploader.upload(localPath, {
    folder: remoteFolder,
  });
};

export const cleanUpLocalPaths = (paths: string[]) => {
  return Promise.all(paths.map((path) => unlink(path)));
};

export const configCloudinary = () => {
  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};
