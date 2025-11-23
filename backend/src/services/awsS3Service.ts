// server/services/awsS3Service.ts
import { 
  S3Client, 
  PutObjectCommand, 
  GetObjectCommand, 
  DeleteObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";

dotenv.config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export class AwsS3Service {
  static async generateUploadUrl(
    title: string,
    fileName: string,
    contentType: string
  ): Promise<{ uploadUrl: string; finalUrl: string }> {
    const bucketName = process.env.AWS_S3_BUCKET!;
    const key = `${title}/${fileName}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    const finalUrl = `https://${process.env.AWS_CLOUDFRONT_DOMAIN}/${key}`;
    return { uploadUrl, finalUrl };
  }

  static async uploadFileToS3(
    title: string,
    fileName: string,
    fileData: Buffer | Uint8Array | Blob | string,
    contentType: string
  ): Promise<string> {
    const bucketName = process.env.AWS_S3_BUCKET!;
    const key = `${title}/${fileName}`;

    const parallelUpload = new Upload({
      client: s3Client,
      params: {
        Bucket: bucketName,
        Key: key,
        Body: fileData,
        ContentType: contentType,
      },
    });

    parallelUpload.on("httpUploadProgress", (progress) => {
      console.log("Upload progress:", progress);
    });

    await parallelUpload.done();
    const finalUrl = `https://${process.env.AWS_CLOUDFRONT_DOMAIN}/${key}`;
    console.log(finalUrl);
    return finalUrl;
  }

  static async generateDownloadUrl(title: string, fileName: string): Promise<string[] | string> {
    const bucketName = process.env.AWS_S3_BUCKET!;
    const listAllFiles = async (): Promise<string[]> => {
      const command = new ListObjectsV2Command({ Bucket: bucketName });
      const response = await s3Client.send(command);
      const result: string[] = [];
      if (response.Contents) {
        for (const item of response.Contents) {
          if (item.Key) result.push(item.Key);
        }
      }
      return result;
    };

    const listFilesInFolder = async (folder: string): Promise<string[]> => {
      const command = new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: folder.endsWith("/") ? folder : folder + "/",
      });
      const response = await s3Client.send(command);
      const result: string[] = [];
      if (response.Contents) {
        for (const item of response.Contents) {
          if (item.Key) result.push(item.Key);
        }
      }
      return result;
    };

    if (!title && !fileName) {
      const allKeys = await listAllFiles();
      const allUrls = await Promise.all(
        allKeys.map(async (key) => {
          const cmd = new GetObjectCommand({ Bucket: bucketName, Key: key });
          return await getSignedUrl(s3Client, cmd, { expiresIn: 3600 });
        }),
      );
      return allUrls;
    }

    if (!title && fileName) {
      const key = fileName;
      const command = new GetObjectCommand({ Bucket: bucketName, Key: key });
      return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    }

    if (title && !fileName) {
      const folderKeys = await listFilesInFolder(title);
      const folderUrls = await Promise.all(
        folderKeys.map(async (k) => {
          const cmd = new GetObjectCommand({ Bucket: bucketName, Key: k });
          return await getSignedUrl(s3Client, cmd, { expiresIn: 3600 });
        }),
      );
      return folderUrls;
    }

    const key = `${title}/${fileName}`;
    const command = new GetObjectCommand({ Bucket: bucketName, Key: key });
    return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  }

  static async deleteFile(fileKey: string): Promise<void> {
    if (!fileKey) {
      console.error("No file key provided.");
      return;
    }
  
    const bucketName = process.env.AWS_S3_BUCKET!;
  
    // Xác định xem có xoá folder hay file dựa vào fileKey:
    // Nếu fileKey không chứa dấu "/" hoặc kết thúc bằng "/" thì coi là folder.
    const isFolder = fileKey.indexOf('/') === -1 || fileKey.endsWith('/');
  
    if (isFolder) {
      // Nếu fileKey không kết thúc bằng "/" thì thêm vào
      const folderPrefix = fileKey.endsWith('/') ? fileKey : fileKey + "/";
      // Lấy danh sách các file trong folder (prefix là folderPrefix)
      const listCommand = new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: folderPrefix,
      });
      const response = await s3Client.send(listCommand);
  
      if (response.Contents && response.Contents.length > 0) {
        const deletePromises = response.Contents.map((item) => {
          if (item.Key) {
            const delCommand = new DeleteObjectCommand({
              Bucket: bucketName,
              Key: item.Key,
            });
            return s3Client.send(delCommand);
          }
        });
        await Promise.all(deletePromises);
        console.log(`Folder ${folderPrefix} and its contents deleted successfully from S3.`);
      } else {
        console.log(`No objects found in folder ${folderPrefix}.`);
      }
    } else {
      // Xoá một file đơn lẻ
      const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
      });
      try {
        await s3Client.send(command);
        console.log(`File ${fileKey} deleted successfully from S3.`);
      } catch (error) {
        console.error(`Error deleting file ${fileKey} from S3:`, error);
        throw error;
      }
    }
  }

  static async listFiles(): Promise<string[]> {
    const bucketName = process.env.AWS_S3_BUCKET!;
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
    });
    const response = await s3Client.send(command);
    const result: string[] = [];
    if (response.Contents) {
      for (const item of response.Contents) {
        if (item.Key) {
          result.push(item.Key);
        }
      }
    }
    return result;
  }

  static async listFilesInFolder(title: string): Promise<string[]> {
    const bucketName = process.env.AWS_S3_BUCKET!;
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: `${title}/`,
    });
    const response = await s3Client.send(command);
    const result: string[] = [];
    if (response.Contents) {
      for (const item of response.Contents) {
        if (item.Key) {
          result.push(item.Key);
        }
      }
    }
    return result;
  }
}
