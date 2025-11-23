// server/controllers/AWSs3/awsS3Controller.ts
import { Request, Response } from "express";
import { AwsS3Service } from "../services/awsS3Service";

export class AWSs3Controller {
  // (1) Tạo upload URL (Presigned PUT) nếu cần
  static async generateUploadUrl(req: Request, res: Response): Promise<any> {
    try {
      const { title, fileName, contentType } = req.body;
      if (!title || !fileName || !contentType) {
        return res.status(400).json({ error: "title, fileName, and contentType are required" });
      }
      const { uploadUrl, finalUrl } = await AwsS3Service.generateUploadUrl(title, fileName, contentType);
      console.log("Upload URL generated successfully");
      return res.json({ uploadUrl, finalUrl });
    } catch (error: any) {
      console.error("Error generating upload URL:", error);
      return res.status(500).json({ error: "Failed to generate upload URL" });
    }
  }

  // (2) Upload file từ client sử dụng multer (file có trong req.file)
  static async uploadFileToS3(req: Request, res: Response): Promise<any> {
    try {
      const { title, fileName, contentType } = req.body;
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const fileData = req.file.buffer;

      const finalUrl = await AwsS3Service.uploadFileToS3(title, fileName, fileData, contentType);
      console.log("File uploaded successfully");
      return res.json({ finalUrl });
    } catch (error: any) {
      console.error("Error uploading file:", error);
      return res.status(500).json({ error: "Failed to upload file" });
    }
  }
  
  // (3) Xóa file trong S3
  static async deleteFileFromS3(req: Request, res: Response): Promise<any> {
    try {
      const { fileKey } = req.body;
      if (!fileKey) {
        return res.status(400).json({ error: "fileKey is required" });
      }
      await AwsS3Service.deleteFile(fileKey);
      console.log("Deletion operation successful");
  
      // Xác định thông báo dựa vào loại xoá
      const isFolder = fileKey.indexOf('/') === -1 || fileKey.endsWith('/');
      return res.json({ 
        message: isFolder 
          ? "Folder deleted successfully from S3" 
          : "File deleted successfully from S3" 
      });
    } catch (error: any) {
      console.error("Error deleting file from S3:", error);
      return res.status(500).json({ error: "Failed to delete file from S3" });
    }
  }
  
  

  // (4) Liệt kê file trong bucket
  static async listFiles(req: Request, res: Response): Promise<any> {
    try {
      const fileKeys = await AwsS3Service.listFiles();
      return res.json({ fileKeys });
    } catch (error: any) {
      console.error("Error listing files:", error);
      return res.status(500).json({ error: "Failed to list files" });
    }
  }

  // (5) Liệt kê file trong folder
  static async listFilesInFolder(req: Request, res: Response): Promise<any> {
    try {
      const { folder } = req.body;
      if (!folder) {
        return res.status(400).json({ error: "folder is required" });
      }
      const fileKeys = await AwsS3Service.listFilesInFolder(folder);
      return res.json({ fileKeys });
    } catch (error: any) {
      console.error("Error listing files in folder:", error);
      return res.status(500).json({ error: "Failed to list files in folder" });
    }
  }
}
