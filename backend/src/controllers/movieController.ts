import { Request, Response } from "express";
import { MovieService } from "../services/movieService";

export class MovieController {
  // GET /movies/:id
  static async getMovie(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const movie = await MovieService.getMovie(id);
      res.json(movie);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  // GET /movies
  static async getAllMovies(req: Request, res: Response) {
    try {
      const movies = await MovieService.getAllMovies();
      res.json(movies);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // POST /movies
  static async createMovie(req: Request, res: Response) {
    try {
      const newMovie = await MovieService.createMovie(req.body);
      res.status(201).json(newMovie);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // PUT /movies/:id
  static async updateMovie(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const updatedMovie = await MovieService.updateMovie(id, req.body);
      res.json(updatedMovie);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  // DELETE /movies/:id
  static async deleteMovie(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const result = await MovieService.deleteMovie(id);
      res.json(result);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
}
