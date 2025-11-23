import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import { Episode } from "./Episode";
import { MovieComment } from "./MovieComment";
import { UserWatchHistory } from "./UserWatchHistory";
import { UserFavorite } from "./UserFavorite";

@Table({
  tableName: "Movies",
  timestamps: true,
})
export class Movie extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  title!: string;

  @Column({ type: DataType.DECIMAL(2, 1), defaultValue: 0 })
  rating!: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  views!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  genre!: string;

  @Column({ type: DataType.TEXT })
  summary!: string;

  @Column({ type: DataType.INTEGER })
  duration!: number;

  @Column({ type: DataType.INTEGER, defaultValue: 1 })
  totalEpisodes!: number;

  @Column({ type: DataType.INTEGER })
  releaseYear!: number;

  @Column({ type: DataType.STRING })
  posterUrl!: string;

  @Column({ type: DataType.STRING })
  trailerUrl!: string;

  // Quan hệ với Episode, Comment, WatchHistory, Favorites
  @HasMany(() => Episode)
  episodes!: Episode[];

  @HasMany(() => MovieComment)
  comments!: MovieComment[];

  @HasMany(() => UserWatchHistory)
  watchHistories!: UserWatchHistory[];

  @HasMany(() => UserFavorite)
  favorites!: UserFavorite[];
}
