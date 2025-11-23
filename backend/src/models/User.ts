import { Model, Table, Column, DataType, CreatedAt, UpdatedAt, HasMany } from "sequelize-typescript";
import { MovieComment } from "./MovieComment";
import { UserWatchHistory } from "./UserWatchHistory";
import { UserFavorite } from "./UserFavorite";

@Table({ tableName: "Users", underscored: true })
export class User extends Model<User> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  full_name!: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password!: string;

  @Column({ type: DataType.ENUM("user", "admin"), allowNull: false, defaultValue: "user" })
  role!: "user" | "admin";

  @CreatedAt
  @Column({ type: DataType.DATE })
  created_at!: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE })
  updated_at!: Date;

  // Quan hệ với bảng MovieComment (User có thể viết nhiều comment)
  @HasMany(() => MovieComment)
  comments!: MovieComment[];

  // Quan hệ với bảng UserWatchHistory (Lịch sử xem phim)
  @HasMany(() => UserWatchHistory)
  watchHistories!: UserWatchHistory[];

  // Quan hệ với bảng UserFavorite (Danh sách yêu thích)
  @HasMany(() => UserFavorite)
  favorites!: UserFavorite[];
}
