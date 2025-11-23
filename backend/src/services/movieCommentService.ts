import { MovieComment } from "../models/MovieComment";

export class MovieCommentService {
  /**
   * Lấy thông tin một bình luận theo id
   */
  static async getCommentById(id: number) {
    const comment = await MovieComment.findByPk(id);
    if (!comment) throw new Error("Comment not found");
    return comment;
  }

  /**
   * Lấy danh sách bình luận của một bộ phim
   */
  static async getCommentsByMovie(movieId: number) {
    return await MovieComment.findAll({
      where: { movieId },
      order: [["createdAt", "DESC"]],
    });
  }

  /**
   * Tạo mới một bình luận
   */
  static async createComment(data: { movieId: number; userId: number; comment: string }) {
    const newComment = await MovieComment.create({
      ...data,
      // createdAt, updatedAt sẽ được Sequelize tự động xử lý nếu timestamps:true
    });
    return newComment;
  }

  /**
   * Cập nhật một bình luận
   */
  static async updateComment(id: number, data: { comment?: string }) {
    const commentRecord = await MovieComment.findByPk(id);
    if (!commentRecord) throw new Error("Comment not found");
    Object.assign(commentRecord, data);
    await commentRecord.save();
    return commentRecord;
  }

  /**
   * Xóa một bình luận theo id
   */
  static async deleteComment(id: number) {
    const commentRecord = await MovieComment.findByPk(id);
    if (!commentRecord) throw new Error("Comment not found");
    await commentRecord.destroy();
    return { message: "Comment deleted successfully" };
  }
}
