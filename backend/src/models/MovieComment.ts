import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Movie } from "./Movie";
import { User } from "./User";

@Table({
  tableName: "MovieComments",
  timestamps: true,
  underscored: true,
})
export class MovieComment extends Model {
  @ForeignKey(() => Movie)
  @Column({ type: DataType.INTEGER, allowNull: false })
  movieId!: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId!: number;

  @Column({ type: DataType.TEXT, allowNull: false })
  comment!: string;

  @BelongsTo(() => Movie)
  movie!: Movie;

  @BelongsTo(() => User)
  user!: User;
}
