import { Request, Response } from "express";
import { MovieCommentService } from "../services/movieCommentService";

export class MovieCommentController {
  // Lấy bình luận theo id
  static async getComment(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const comment = await MovieCommentService.getCommentById(id);
      res.json(comment);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  // Lấy danh sách bình luận của một bộ phim
  static async getCommentsByMovie(req: Request, res: Response): Promise<void> {
    try {
      const movieId = parseInt(req.params.movieId);
      const comments = await MovieCommentService.getCommentsByMovie(movieId);
      res.json(comments);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Tạo mới một bình luận
  static async createComment(req: Request, res: Response): Promise<void> {
    try {
      // Lấy userId từ token (middleware authenticate đã gán req.user)
      const userId = (req as any).user.id;
      const { movieId, comment } = req.body;
      if (!movieId || !comment) {
        res.status(400).json({ error: "movieId and comment are required" });
        return;
      }
      const newComment = await MovieCommentService.createComment({ movieId, userId, comment });
      res.status(201).json(newComment);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Cập nhật một bình luận
  static async updateComment(req: Request, res: Response): Promise<void> {
    try {
      const commentId = parseInt(req.params.id);
      const currentUser = (req as any).user;
      const existingComment = await MovieCommentService.getCommentById(commentId);
      
      // Kiểm tra quyền: chỉ cho phép người tạo bình luận hoặc admin cập nhật
      if (existingComment.userId !== currentUser.id && currentUser.role !== "admin") {
        res.status(403).json({ error: "Access denied. You can only update your own comment." });
        return;
      }
      
      const { comment } = req.body;
      if (!comment) {
        res.status(400).json({ error: "Comment field is required" });
        return;
      }
      const updatedComment = await MovieCommentService.updateComment(commentId, { comment });
      res.json(updatedComment);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  // Xóa một bình luận
  static async deleteComment(req: Request, res: Response): Promise<void> {
    try {
      const commentId = parseInt(req.params.id);
      const currentUser = (req as any).user;
      const existingComment = await MovieCommentService.getCommentById(commentId);
      
      // Kiểm tra quyền: chỉ cho phép người tạo bình luận hoặc admin xóa
      if (existingComment.userId !== currentUser.id && currentUser.role !== "admin") {
        res.status(403).json({ error: "Access denied. You can only delete your own comment." });
        return;
      }
      
      const result = await MovieCommentService.deleteComment(commentId);
      res.json(result);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
}
