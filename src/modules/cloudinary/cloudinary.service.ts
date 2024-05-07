import { Injectable } from '@nestjs/common';
import { UploadApiOptions, v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './constants/cloudinary.constant';
const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
  uploadFile(
    file: Express.Multer.File,
    folderName: string,
  ): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadOptions: UploadApiOptions = {
        folder: folderName,
      };

      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async uploadFiles(
    files: Express.Multer.File[],
    folderName: string,
  ): Promise<CloudinaryResponse[]> {
    try {
      const uploadPromises = files.map((file) =>
        this.uploadFile(file, folderName),
      );
      const results = await Promise.all(uploadPromises);
      return results;
    } catch (error) {
      throw error;
    }
  }
}
