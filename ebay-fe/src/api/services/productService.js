import axiosClient from "@/api/config/axiosClient";

export const getProducts = (params) => {
  return axiosClient.get(`/products`, { params });
};
