"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { API_ENDPOINTS } from "@/config/api";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Calcular la fortaleza de la contraseña
    const strength = password.length > 8 ? (password.length > 12 ? 100 : 66) : 33;
    setPasswordStrength(strength);
  }, [password]);

  const validateForm = () => {
    if (!fullName) {
      toast.error("Vui lòng nhập họ tên");
      return false;
    }
    if (!email) {
      toast.error("Vui lòng nhập email");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Email không hợp lệ");
      return false;
    }
    if (!password) {
      toast.error("Vui lòng nhập mật khẩu");
      return false;
    }
    if (password.length < 8) {
      toast.error("Mật khẩu phải có ít nhất 8 ký tự");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Mật khẩu không khớp");
      return false;
    }
    if (!agreeTerms) {
      toast.error("Vui lòng đồng ý với Điều khoản và Điều kiện");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const payload = {
        full_name: fullName,
        email,
        password,
      };

      try {
        const response = await axios.post(
          API_ENDPOINTS.AUTH.SIGNUP,
          payload,
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        console.log("Đăng ký thành công:", response.data);
        toast.success("Đăng ký thành công!");
        router.push("/sign-in");
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message || "Đăng ký thất bại");
        } else {
          toast.error("Đã xảy ra lỗi không xác định");
        }
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-full max-w-md">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-white">Tạo tài khoản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-white">
                  Họ và tên
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Mật khẩu
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 pr-10"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white focus:outline-none"
                  >
                    {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                  </button>
                </div>
                <Progress value={passwordStrength} className="h-1" />
                <p className="text-sm text-gray-400">
                  Độ mạnh mật khẩu: {passwordStrength < 50 ? "Yếu" : passwordStrength < 80 ? "Trung bình" : "Mạnh"}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white">
                  Xác nhận mật khẩu
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 pr-10"
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white focus:outline-none"
                  >
                    {showConfirmPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeTerms}
                  onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm text-gray-300">
                  Tôi đồng ý với{" "}
                  <Link href="/terms" className="text-blue-400 hover:underline">
                    Điều khoản và Điều kiện
                  </Link>
                </Label>
              </div>
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
                Đăng ký
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-gray-400">
              Đã có tài khoản?{" "}
              <Link href="/sign-in" className="text-blue-400 hover:underline">
                Đăng nhập
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
      <Image
        src="/placeholder.svg?height=1080&width=1920"
        alt="Nền"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 -z-10 opacity-20"
      />
    </div>
  );
}
