import { Router } from "express";
import { UserFavoriteController } from "../controllers/userFavoriteController";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware";

const router = Router();

// Tất cả các route dưới đây yêu cầu người dùng đã đăng nhập

// GET /api/user-favorites
// Lấy danh sách các mục yêu thích của chính user (dùng token)
router.get("/", authenticate, UserFavoriteController.getMyFavorites);

// GET /api/user-favorites/user/:userId
// Lấy danh sách yêu thích của một user cụ thể (chỉ admin được phép)
router.get("/user/:userId", authenticate, authorizeAdmin, UserFavoriteController.getFavoritesByUser);

// POST /api/user-favorites
// Tạo mới mục yêu thích, userId được lấy từ token
router.post("/", authenticate, UserFavoriteController.createFavorite);

// DELETE /api/user-favorites/movie/:movieId
// Xóa mục yêu thích của user theo movieId
router.delete("/movie/:movieId", authenticate, UserFavoriteController.deleteFavorite);

export default router;
