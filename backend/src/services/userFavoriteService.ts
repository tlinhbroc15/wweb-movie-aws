import { UserFavorite } from "../models/UserFavorite";

export class UserFavoriteService {
  /**
   * Lấy thông tin 1 mục yêu thích theo id
   * @param id - ID của bản ghi yêu thích
   */
  static async getFavoriteById(id: number) {
    const favorite = await UserFavorite.findByPk(id);
    if (!favorite) throw new Error("UserFavorite not found");
    return favorite;
  }

  /**
   * Lấy danh sách các mục yêu thích của một user
   * @param userId - ID của user
   */
  static async getFavoritesByUser(userId: number) {
    return await UserFavorite.findAll({ where: { userId } });
  }

  /**
   * Tạo mới một mục yêu thích.
   * Nếu mục yêu thích đã tồn tại (theo userId và movieId), có thể trả về thông báo hoặc không tạo thêm.
   *
   * @param data - Dữ liệu gồm userId và movieId
   */
  static async createFavorite(data: { userId: number; movieId: number }) {
    // Kiểm tra xem mục yêu thích đã tồn tại chưa
    const existing = await UserFavorite.findOne({
      where: { userId: data.userId, movieId: data.movieId },
    });
    if (existing) throw new Error("Movie already favorited by user");

    const newFavorite = await UserFavorite.create({
      ...data,
      favoritedAt: new Date(),
    });
    return newFavorite;
  }

  /**
   * Xóa mục yêu thích theo userId và movieId
   * @param userId - ID của user
   * @param movieId - ID của movie
   */
  static async deleteFavoriteByUserAndMovie(userId: number, movieId: number) {
    const favorite = await UserFavorite.findOne({ where: { userId, movieId } });
    if (!favorite) throw new Error("UserFavorite not found");

    await favorite.destroy();
    return { message: "UserFavorite deleted successfully" };
  }
}
