import bcrypt from "bcryptjs";
import { User } from "../models/User";

export class CustomerService {
  // Lấy thông tin 1 khách hàng theo ID
  static async getCustomer(id: number) {
    const customer = await User.findByPk(id, { attributes: { exclude: ["password"] } });
    if (!customer) throw new Error("Customer not found");
    return customer;
  }

  // Lấy thông tin hồ sơ của chính user đang đăng nhập
  static async getCustomerProfile(userId: number) {
    return await CustomerService.getCustomer(userId);
  }

  // Xóa khách hàng (Chỉ Admin được phép)
  static async deleteCustomer(id: number) {
    const customer = await User.findByPk(id);
    if (!customer) throw new Error("Customer not found");

    await customer.destroy();
    return { message: "Customer deleted successfully" };
  }

  // Lấy danh sách tất cả khách hàng (Chỉ Admin được phép)
  static async getAllCustomers() {
    return await User.findAll({ attributes: { exclude: ["password"] } });
  }

  /**
   * Cập nhật thông tin khách hàng.
   * Lưu ý: Không cho phép cập nhật các trường nhạy cảm như password, role, …
   *
   * @param id - ID của khách hàng cần cập nhật
   * @param data - Dữ liệu cập nhật, cho phép update các trường như full_name, email
   * @returns Customer sau khi cập nhật
   */
  static async updateCustomer(
    id: number,
    data: { full_name?: string; email?: string }
  ) {
    const customer = await User.findByPk(id);
    if (!customer) throw new Error("Customer not found");

    // Cập nhật các trường cho phép (chỉ cập nhật full_name và email)
    if (data.full_name !== undefined) {
      customer.full_name = data.full_name;
    }
    if (data.email !== undefined) {
      customer.email = data.email;
    }

    // Lưu ý: Sequelize sẽ tự động cập nhật trường updated_at nếu cấu hình timestamps = true
    await customer.save();

    // Trả về customer sau khi update (có thể loại bỏ password nếu cần)
    const { password, ...customerData } = customer.toJSON();
    return customerData;
  }

  /**
   * Thay đổi mật khẩu cho khách hàng.
   *
   * @param id - ID của khách hàng cần thay đổi mật khẩu
   * @param currentPassword - Mật khẩu hiện tại (để xác thực)
   * @param newPassword - Mật khẩu mới
   * @returns Thông báo cập nhật thành công
   */
  static async changePassword(
    id: number,
    currentPassword: string,
    newPassword: string
  ) {
    const customer = await User.findByPk(id);
    if (!customer) throw new Error("Customer not found");

    // Kiểm tra xem mật khẩu hiện tại có khớp với mật khẩu đã mã hoá trong database không
    const isMatch = await bcrypt.compare(currentPassword, customer.password);
    if (!isMatch) throw new Error("Current password is incorrect");

    // Tạo salt và hash cho mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Cập nhật mật khẩu mới
    customer.password = hashedPassword;
    await customer.save();

    return { message: "Password updated successfully" };
  }
}
