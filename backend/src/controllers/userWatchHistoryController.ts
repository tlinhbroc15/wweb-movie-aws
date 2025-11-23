import { Request, Response } from "express";
import { UserWatchHistoryService } from "../services/userWatchHistoryService";

export class UserWatchHistoryController {
  // GET /api/user-watch-histories
  static async getMyWatchHistories(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const histories = await UserWatchHistoryService.getWatchHistoriesByUser(userId);
      res.json(histories);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/user-watch-histories/user/:userId
  static async getWatchHistoriesByUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      const histories = await UserWatchHistoryService.getWatchHistoriesByUser(userId);
      res.json(histories);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // POST /api/user-watch-histories
  // Sử dụng upsert để đảm bảo không tạo bản ghi trùng lặp cho (userId, movieId)
  static async createWatchHistory(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const { movieId, watchedAt } = req.body;
      if (!movieId) {
        res.status(400).json({ error: "movieId is required" });
        return;
      }
      // Gọi hàm upsert thay vì chỉ create
      const record = await UserWatchHistoryService.upsertWatchHistory({ userId, movieId, watchedAt });
      res.status(201).json(record);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // DELETE /api/user-watch-histories/:id
  static async deleteWatchHistory(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const result = await UserWatchHistoryService.deleteWatchHistory(id);
      res.json(result);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
}
