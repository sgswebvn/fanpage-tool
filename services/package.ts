import api from "./api";
import { Package } from "../interfaces/package";

export const getPackages = async (): Promise<Package[]> => {
  const res = await api.get("/packages");
  return res.data;
};

export const createPackage = async (data: Partial<Package>) => {
  const res = await api.post("/packages", data);
  return res.data;
};

export const updatePackage = async (id: string, data: Partial<Package>) => {
  const res = await api.put(`/packages/${id}`, data);
  return res.data;
};

export const deletePackage = async (id: string) => {
  await api.delete(`/packages/${id}`);
};