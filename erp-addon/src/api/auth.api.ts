import {authApi } from "./axios.ts";

export async function login(email: string, password: string) {
  const response = await authApi.post("/login", { email, password });
 
  const { token, refreshToken } = response.data;
 
  // Lưu token với key nhất quán
  localStorage.setItem("token", token);
  localStorage.setItem("refreshToken", refreshToken);
 
  return response.data;
}