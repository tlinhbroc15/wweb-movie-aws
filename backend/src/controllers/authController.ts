import { Request, Response } from "express";
import { AuthService } from "../services/authService";
import { User } from "../models/User";  // Đảm bảo bạn import model User

export class AuthController {
  static async registerUser(req: Request, res: Response): Promise<void> {
    try {
      const { full_name, email, password } = req.body;

      // Gọi service để đăng ký user
      const newUser: User = await AuthService.registerUser(full_name, email, password);

      res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error: unknown) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  static async registerAdmin(req: Request, res: Response): Promise<void> {
    try {
      const { full_name, email, password } = req.body;

      // Gọi service để đăng ký admin
      const newAdmin: User = await AuthService.registerAdmin(full_name, email, password);

      res.status(201).json({ message: "Admin registered successfully", admin: newAdmin });
    } catch (error: unknown) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
  
      // Gọi service để đăng nhập và lấy user + token
      const { user, token } = await AuthService.login(email, password);
      
      // Cấu hình cookie cho token
      res.cookie("jwt", token, {
        httpOnly: true,  // Ngăn chặn truy cập từ JS phía client
        secure: process.env.NODE_ENV === "production",  // Chỉ truyền qua HTTPS trong môi trường production
        sameSite: "strict",  // Giúp hạn chế CSRF
        maxAge: parseInt(process.env.TOKEN_EXPIRES_IN || "86400", 10) * 1000,  // Thời gian sống của cookie (tính bằng milliseconds)
      });

      res.json({ user, token });
  
      // Thêm token vào JSON trả về
      res.status(200).json({ message: "Login successful", user, token });
    } catch (error: unknown) {
      res.status(401).json({ message: (error as Error).message });
    }
  }
  

  static async oauthCheck(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      console.log("Received email: ", email); 
      // Kiểm tra xem user đã có trong hệ thống chưa
      let existingUser: User | null = await User.findOne({ where: { email } });

      if (!existingUser) {
        // Nếu chưa có user, tạo user mới (Bỏ qua mật khẩu)
        const newUser = await AuthService.registerUser("Google User", email, "");  // Không cần mật khẩu cho OAuth
        console.log("Created new user: ", newUser);  // Thêm log này
        res.status(201).json({ message: "User created and logged in", user: newUser });
      } else {
        // Nếu user đã tồn tại, đăng nhập và trả về token
        const { token } = await AuthService.login(email, "");  // Không cần mật khẩu cho OAuth
        res.status(200).json({ message: "Login successful", token });
      }
    } catch (error: unknown) {
      console.error("Error checking user: ", error);
      res.status(400).json({ message: (error as Error).message });
    }
  }
}
