import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import dotenv from "dotenv";

dotenv.config();

export class AuthService {
  // Đăng ký User (Mặc định role là "user")
  static async registerUser(full_name: string, email: string, password: string): Promise<User> {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      full_name,
      email,
      password: hashedPassword,
      role: "user", 
    } as User);

    return newUser;
  }

  // Đăng ký Admin
  static async registerAdmin(full_name: string, email: string, password: string): Promise<User> {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await User.create({
      full_name,
      email,
      password: hashedPassword,
      role: "admin",
    } as User);

    return newAdmin;
  }

  // Đăng nhập User
  static async login(email: string, password: string = ""): Promise<{ user: User, token: string }> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Nếu đăng nhập bằng OAuth, không cần kiểm tra mật khẩu
    if (password && !(await bcrypt.compare(password, user.password))) {
      throw new Error("Invalid email or password");
    }

    const secretKey: string = process.env.JWT_SECRET || "defaultSecretKey";
    const expiresInSeconds: number = parseInt(process.env.TOKEN_EXPIRES_IN || "86400", 10);

    const token = jwt.sign(
      { id: user.id, role: user.role },
      secretKey,
      { expiresIn: expiresInSeconds }
    );

    return { user, token };
  }

}
