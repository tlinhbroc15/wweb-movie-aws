import { Router } from "express";
import { MovieController } from "../controllers/movieController";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware";
const router = Router();

router.get("/", MovieController.getAllMovies);
router.get("/:id", MovieController.getMovie);
router.post("/", authenticate, authorizeAdmin,  MovieController.createMovie);
router.put("/:id" , authenticate, authorizeAdmin, MovieController.updateMovie);
router.delete("/:id", authenticate, authorizeAdmin, MovieController.deleteMovie);

export default router;
