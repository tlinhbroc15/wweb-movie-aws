// server/routes/awsRouter.ts
import { Router } from "express";
import multer from "multer";
import { AWSs3Controller } from "../controllers/awsS3Controller";

// Cấu hình multer sử dụng bộ nhớ tạm
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = Router();

// API tạo upload URL (nếu cần)
router.post("/upload-url", AWSs3Controller.generateUploadUrl);

// API upload file sử dụng multer (dùng upload.single("file") để nhận file từ client)
router.post("/upload", upload.single("file"), AWSs3Controller.uploadFileToS3);

router.delete("/file", AWSs3Controller.deleteFileFromS3);
router.get("/list", AWSs3Controller.listFiles);
router.post("/list-folder", AWSs3Controller.listFilesInFolder);

export default router;
