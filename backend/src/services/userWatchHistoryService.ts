import { UserWatchHistory } from "../models/UserWatchHistory";

export class UserWatchHistoryService {
  /**
   * Lấy thông tin 1 bản ghi lịch sử xem theo id
   * @param id - ID của bản ghi lịch sử xem
   */
  static async getWatchHistoryById(id: number) {
    const history = await UserWatchHistory.findByPk(id);
    if (!history) throw new Error("UserWatchHistory not found");
    return history;
  }

  /**
   * Lấy danh sách lịch sử xem của một user
   * @param userId - ID của user
   */
  static async getWatchHistoriesByUser(userId: number) {
    return await UserWatchHistory.findAll({
      where: { userId },
      order: [["watchedAt", "DESC"]],
    });
  }

  /**
   * Upsert một bản ghi lịch sử xem.
   * Nếu đã tồn tại bản ghi với cùng userId và movieId thì cập nhật lại trường watchedAt.
   * Nếu chưa tồn tại thì tạo mới bản ghi.
   * @param data - Dữ liệu gồm userId, movieId và (tuỳ chọn) watchedAt.
   */
  static async upsertWatchHistory(data: { userId: number; movieId: number; watchedAt?: Date }) {
    const now = data.watchedAt || new Date();
    // Tìm xem đã có bản ghi với cặp userId và movieId hay chưa
    let record = await UserWatchHistory.findOne({
      where: { userId: data.userId, movieId: data.movieId },
    });
    if (record) {
      // Nếu đã tồn tại, cập nhật trường watchedAt (và updatedAt nếu cần)
      record.watchedAt = now;
      await record.save();
    } else {
      // Nếu chưa tồn tại, tạo mới bản ghi
      record = await UserWatchHistory.create({
        ...data,
        watchedAt: now,
      });
    }
    return record;
  }

  /**
   * Xóa một bản ghi lịch sử xem theo id
   * @param id - ID của bản ghi lịch sử xem cần xóa
   */
  static async deleteWatchHistory(id: number) {
    const record = await UserWatchHistory.findByPk(id);
    if (!record) throw new Error("UserWatchHistory not found");
    await record.destroy();
    return { message: "UserWatchHistory deleted successfully" };
  }
}
