// src/controllers/userFavoriteController.ts
import { Request, Response } from "express";
import { UserFavoriteService } from "../services/userFavoriteService";

export class UserFavoriteController {
  static async getMyFavorites(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const favorites = await UserFavoriteService.getFavoritesByUser(userId);
      res.json(favorites);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getFavoritesByUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      const favorites = await UserFavoriteService.getFavoritesByUser(userId);
      res.json(favorites);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createFavorite(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const { movieId } = req.body;
      if (!movieId) {
        res.status(400).json({ error: "movieId is required" });
        return;
      }
      const favorite = await UserFavoriteService.createFavorite({ userId, movieId });
      res.status(201).json(favorite);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteFavorite(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const movieId = parseInt(req.params.movieId);
      const result = await UserFavoriteService.deleteFavoriteByUserAndMovie(userId, movieId);
      res.json(result);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
}
