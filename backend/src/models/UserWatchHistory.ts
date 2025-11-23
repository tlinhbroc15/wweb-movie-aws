import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import { User } from "./User";
import { Movie } from "./Movie";

@Table({
  tableName: "UserWatchHistories",
  timestamps: true,
})
export class UserWatchHistory extends Model {
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId!: number;

  @ForeignKey(() => Movie)
  @Column({ type: DataType.INTEGER, allowNull: false })
  movieId!: number;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  watchedAt!: Date;

  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => Movie)
  movie!: Movie;
}
