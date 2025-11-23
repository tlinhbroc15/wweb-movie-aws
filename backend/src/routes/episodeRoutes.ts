import { Router } from "express";
import { EpisodeController } from "../controllers/episodeController";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware";

const router = Router();

// Route lấy các tập phim theo movieId (không bắt buộc admin)
router.get("/movie/:movieId", EpisodeController.getEpisodesByMovie);

// Route lấy danh sách tất cả tập phim (có thể không cần admin)
router.get("/", EpisodeController.getAllEpisodes);

// Route lấy thông tin tập phim theo id (không cần admin)
router.get("/:id", EpisodeController.getEpisode);

// Các route dưới đây yêu cầu token của admin:

// Tạo mới một tập phim
router.post("/", authenticate, authorizeAdmin, EpisodeController.createEpisode);

// Cập nhật tập phim theo id
router.put("/:id", authenticate, authorizeAdmin, EpisodeController.updateEpisode);

// **Endpoint mới:** Cập nhật tập phim theo movieId và episodeNumber
router.put("/movie/:movieId/episode/:episodeNumber", authenticate, authorizeAdmin, EpisodeController.updateEpisodeByMovieAndNumber);

// Xóa tập phim theo id
router.delete("/:id", authenticate, authorizeAdmin, EpisodeController.deleteEpisode);

export default router;
