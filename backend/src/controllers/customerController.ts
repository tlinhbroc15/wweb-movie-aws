import { Request, Response } from "express";
import { CustomerService } from "../services/customerService";

export class CustomerController {
  // Lấy thông tin 1 khách hàng theo ID
  static async getCustomer(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const customer = await CustomerService.getCustomer(id);
      res.status(200).json(customer);
    } catch (error: unknown) {
      res.status(404).json({ message: (error as Error).message });
    }
  }

  // Lấy thông tin hồ sơ của user đang đăng nhập
  static async getCustomerProfile(req: Request, res: Response) {
    try {
      // Giả sử middleware xác thực đã gán thông tin user vào req.user
      const customer = await CustomerService.getCustomerProfile((req as any).user.id);
      res.status(200).json(customer);
    } catch (error: unknown) {
      res.status(404).json({ message: (error as Error).message });
    }
  }

  // Cập nhật thông tin khách hàng (chỉ cho phép cập nhật full_name và email)
  static async updateCustomer(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const updatedCustomer = await CustomerService.updateCustomer(id, req.body);
      res.status(200).json(updatedCustomer);
    } catch (error: unknown) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  // Xóa khách hàng (chỉ admin được phép)
  static async deleteCustomer(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const result = await CustomerService.deleteCustomer(id);
      res.status(200).json(result);
    } catch (error: unknown) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  // Thay đổi mật khẩu cho khách hàng
  static async changePassword(req: Request, res: Response) {
    try {
      // Giả sử middleware xác thực đã gán thông tin user vào req.user
      const id = (req as any).user.id;
      // Lấy currentPassword và newPassword từ request body (đã chỉnh theo CustomerService)
      const { currentPassword, newPassword } = req.body;
      const result = await CustomerService.changePassword(id, currentPassword, newPassword);
      res.status(200).json(result);
    } catch (error: unknown) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  // Lấy danh sách tất cả khách hàng (chỉ admin được phép)
  static async getAllCustomers(req: Request, res: Response) {
    try {
      const customers = await CustomerService.getAllCustomers();
      res.status(200).json(customers);
    } catch (error: unknown) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
}
