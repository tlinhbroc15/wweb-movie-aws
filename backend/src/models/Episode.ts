import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Movie } from "./Movie";

@Table({
  tableName: "Episodes",
  timestamps: true,
  underscored: true

})
export class Episode extends Model {
  @ForeignKey(() => Movie)
  @Column({ type: DataType.INTEGER, allowNull: false, field: "movie_id" })
  movieId!: number;

  @Column({ type: DataType.INTEGER, allowNull: false, field: "episode_number" })
  episodeNumber!: number;

  // @Column({ type: DataType.INTEGER, allowNull: false })
  // episodeViews!: number;

  @Column({ type: DataType.STRING, allowNull: false, field: "video_url" })
  videoUrl!: string;

  @BelongsTo(() => Movie)
  movie!: Movie;
}
