import api from "@/services"; // Giả sử index.js được export default là api, và import alias @/services trỏ đến nó

/**
 * Lấy danh sách tất cả địa chỉ của người dùng hiện tại
 * GET /api/addresses
 */
export const getAddresses = async () => {
  try {
    const response = await api.get("/addresses");
    return response.data.addresses; // Giả sử server trả về { success: true, addresses: [...] }
  } catch (error) {
    console.error("Error fetching addresses:", error);
    throw error;
  }
};

/**
 * Tạo địa chỉ mới
 * POST /api/addresses
 */
export const createAddress = async (addressData) => {
  try {
    const response = await api.post("/addresses", addressData);
    return response.data.address; // Giả sử server trả về { success: true, address: {...} }
  } catch (error) {
    console.error("Error creating address:", error);
    throw error;
  }
};

/**
 * Cập nhật địa chỉ theo ID
 * PATCH /api/addresses/:id
 */
export const updateAddress = async (id, addressData) => {
  try {
    const response = await api.patch(`/addresses/${id}`, addressData);
    return response.data.address; // Giả sử server trả về { success: true, address: {...} }
  } catch (error) {
    console.error(`Error updating address ${id}:`, error);
    throw error;
  }
};

/**
 * Xóa địa chỉ theo ID
 * DELETE /api/addresses/:id
 */
export const deleteAddress = async (id) => {
  try {
    const response = await api.delete(`/addresses/${id}`);
    return response.data; // Server trả về { success: true, message: "Address deleted" }
  } catch (error) {
    console.error(`Error deleting address ${id}:`, error);
    throw error;
  }
};
