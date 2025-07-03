import api from "./api";
import { User } from "../interfaces/user";

export const getUsers = async (): Promise<User[]> => {
  const res = await api.get("/users");
  return res.data;
};

export const lockUser = async (id: string) => {
  await api.put(`/users/${id}/lock`);
};
export const unlockUser = async (id: string) => {
  await api.put(`/users/${id}/unlock`);
};