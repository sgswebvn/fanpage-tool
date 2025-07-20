import api from "./api";
import { User } from "../interfaces/user";

export const getUsers = async (): Promise<User[]> => {
  try {
    const res = await api.get("/users");
    if (!Array.isArray(res.data)) {
      throw new Error("Dữ liệu trả về không phải là danh sách người dùng");
    }
    return res.data as User[];
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Không thể lấy danh sách người dùng");
  }
};

export const GetProfile = async (): Promise<User> => {
  try {
    const res = await api.get("/auth/me");
    return res.data as User;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Không thể lấy thông tin người dùng");
  }
};

export const lockUser = async (id: string): Promise<void> => {
  try {
    await api.put(`/users/${id}/lock`);
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Không thể khóa người dùng");
  }
};

export const unlockUser = async (id: string): Promise<void> => {
  try {
    await api.put(`/users/${id}/unlock`);
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Không thể mở khóa người dùng");
  }
};