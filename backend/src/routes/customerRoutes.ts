import express from "express";
import { CustomerController } from "../controllers/customerController";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware";

const router = express.Router();

// Các route không có tham số động cần đặt trước
router.get("/profile", authenticate, CustomerController.getCustomerProfile);
router.put("/change-password", authenticate, CustomerController.changePassword);

// Sau đó đặt các route có tham số động
router.get("/:id", authenticate, authorizeAdmin, CustomerController.getCustomer);
router.put("/:id", authenticate, CustomerController.updateCustomer);
router.delete("/:id", authenticate, authorizeAdmin, CustomerController.deleteCustomer);
router.get("/", authenticate, authorizeAdmin, CustomerController.getAllCustomers);

export default router;
