import { Router } from "express";
import { UserWatchHistoryController } from "../controllers/userWatchHistoryController";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware";

const router = Router();

// Lấy lịch sử xem của chính user (dựa trên token)
router.get("/", authenticate, UserWatchHistoryController.getMyWatchHistories);

// (Admin) Lấy lịch sử xem của một user cụ thể
router.get("/user/:userId", authenticate, authorizeAdmin, UserWatchHistoryController.getWatchHistoriesByUser);

// Tạo mới một bản ghi lịch sử xem (userId được lấy từ token)
router.post("/", authenticate, UserWatchHistoryController.createWatchHistory);

// Xóa một bản ghi lịch sử xem theo id
router.delete("/:id", authenticate, UserWatchHistoryController.deleteWatchHistory);

export default router;
