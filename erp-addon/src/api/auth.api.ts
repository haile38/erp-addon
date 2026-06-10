import { authApi } from "./axios";

export async function login(email: string, password: string) {
  const response = await authApi.post("/login", { email, password });

  // API trả về: { return, message, token, refreshToken }
  return response.data;
}

export async function logout() {
  const refreshToken = localStorage.getItem("refreshToken");
  
  // Gọi API logout để invalidate token phía server (nếu có)
  if (refreshToken) {
    try {
      await authApi.post("/logout", { refreshToken });
    } catch {
      // Dù API lỗi vẫn tiếp tục clear local storage
    }
  }
}