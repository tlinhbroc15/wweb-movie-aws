import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Mở rộng kiểu Request để thêm thuộc tính cookies
declare global {
  namespace Express {
    interface Request {
      cookies: { [key: string]: string };
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
   // Log headers và cookies để kiểm tra
   console.log("Request Headers: ", req.headers); // Kiểm tra header
   console.log("Request Cookies: ", req.cookies); // Kiểm tra cookie
  // Ưu tiên lấy token từ header "Authorization"
  let token = req.header("Authorization");

  // Nếu không có token trong header, thử lấy từ cookie (yêu cầu phải sử dụng cookie-parser)
  if (!token && req.cookies) {
    token = req.cookies.jwt;
  }

  if (!token) {
    res.status(401).json({ message: "Access denied. No token provided." });
    return;
  }

  try {
    
    // Nếu token được gửi qua header có chứa "Bearer ", loại bỏ phần này
    if (token.startsWith("Bearer ")) {
      token = token.replace("Bearer ", "");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    (req as any).user = decoded;  // Gán thông tin user vào request
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
    return;
  }
};

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction): void => {
  // Kiểm tra xem user có quyền admin không
  if ((req as any).user.role !== "admin") {
    res.status(403).json({ message: "Access denied. Admins only." });
    return;
  }
  next();
};
