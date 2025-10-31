import axiosClient from "@/api/config/axiosClient";

export const getCategories = () => {
  return axiosClient.get(`/categories`);
};
