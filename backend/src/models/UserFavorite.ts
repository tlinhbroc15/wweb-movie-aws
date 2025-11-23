import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import { User } from "./User";
import { Movie } from "./Movie";

@Table({
  tableName: "UserFavorites",
  timestamps: true,
})
export class UserFavorite extends Model {
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId!: number;

  @ForeignKey(() => Movie)
  @Column({ type: DataType.INTEGER, allowNull: false })
  movieId!: number;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  favoritedAt!: Date;

  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => Movie)
  movie!: Movie;
}
