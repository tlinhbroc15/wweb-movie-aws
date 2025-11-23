import { Router } from "express";
import { MovieCommentController } from "../controllers/movieCommentController";
import { authenticate ,authorizeAdmin } from "../middlewares/authMiddleware";

const router = Router();

// Lấy bình luận theo id (có thể public)
router.get("/:id", MovieCommentController.getComment);

// Lấy danh sách bình luận của một bộ phim
router.get("/movie/:movieId", MovieCommentController.getCommentsByMovie);

// Các endpoint tạo, cập nhật, xóa yêu cầu người dùng đã đăng nhập
router.post("/", authenticate, MovieCommentController.createComment);
router.put("/:id", authenticate, authorizeAdmin, MovieCommentController.updateComment);
router.delete("/:id", authenticate, authorizeAdmin, MovieCommentController.deleteComment);

export default router;
