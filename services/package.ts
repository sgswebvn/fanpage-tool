import api from "./api";
import { Package } from "../interfaces/package";

export const getPackages = async (): Promise<Package[]> => {
  try {
    const res = await api.get("/packages");
    if (!Array.isArray(res.data)) {
      throw new Error("Dữ liệu trả về không phải là danh sách gói");
    }
    return res.data as Package[];
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Không thể lấy danh sách gói");
  }
};

export const createPackage = async (data: Partial<Package>): Promise<Package> => {
  try {
    const res = await api.post("/packages", data);
    return res.data as Package;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Không thể tạo gói");
  }
};

export const updatePackage = async (id: string, data: Partial<Package>): Promise<Package> => {
  try {
    const res = await api.put(`/packages/${id}`, data);
    return res.data as Package;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Không thể cập nhật gói");
  }
};

export const deletePackage = async (id: string): Promise<void> => {
  try {
    await api.delete(`/packages/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Không thể xóa gói");
  }
};