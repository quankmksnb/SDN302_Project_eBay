"use client";
import React, { useState, useEffect } from "react";
import { createAddress, updateAddress } from "@/services/addressService"; // <--- IMPORT MỚI

// Nhận addresses, selectedAddressId, setSelectedAddressId, và onAddressChange qua props
const ShipTo = ({
  addresses,
  selectedAddressId,
  setSelectedAddressId,
  onAddressChange,
}) => {
  // Xóa state addresses mock
  // const [addresses, setAddresses] = useState([...])

  // Sử dụng props thay cho state cục bộ
  // const [selectedId, setSelectedId] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "", // Đổi tên trường từ 'name' sang 'fullname' theo Address Model
    phone: "", // Đổi tên trường từ 'phone' sang 'phone'
    street: "", // Đổi tên trường từ 'address' sang 'street' theo Address Model
    city: "",
    state: "", // Thêm state
    country: "Vietnam",
    isDefault: false, // Thêm isDefault
  });

  // Load dữ liệu địa chỉ vào form khi edit
  useEffect(() => {
    if (isAdding && formData._id) {
      // Khi edit, cần đảm bảo các trường trong form match với object từ addresses
      const addrToEdit = addresses.find((a) => a._id === formData._id);
      if (addrToEdit) {
        setFormData({
          _id: addrToEdit._id,
          fullname: addrToEdit.fullname,
          phone: addrToEdit.phone,
          street: addrToEdit.street,
          city: addrToEdit.city,
          state: addrToEdit.state || "", // Thêm state
          country: addrToEdit.country,
          isDefault: addrToEdit.isDefault || false,
        });
      }
    }
  }, [isAdding, formData._id, addresses]);

  // Hàm chọn địa chỉ
  const handleSelect = (id) => {
    setSelectedAddressId(id);
  };

  // Hàm chuẩn bị form để Edit
  const handleEdit = (id) => {
    const addr = addresses.find((a) => a._id === id);
    if (addr) {
      setFormData({
        _id: addr._id, // Giữ lại ID để biết là đang update
        fullname: addr.fullname,
        phone: addr.phone,
        street: addr.street,
        city: addr.city,
        state: addr.state || "",
        country: addr.country,
        isDefault: addr.isDefault || false,
      });
      setIsAdding(true);
    }
  };

  // Hàm xóa địa chỉ
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this address?")) {
      try {
        await deleteAddress(id);
        alert("Address deleted successfully!");
        onAddressChange(); // Gọi hàm re-fetch từ parent (Checkout.jsx)
        if (selectedAddressId === id) {
          // Nếu xóa địa chỉ đang được chọn, chọn lại địa chỉ mặc định/đầu tiên sau khi re-fetch
          setSelectedAddressId(null);
        }
      } catch (error) {
        console.error("Error deleting address:", error);
        alert("Failed to delete address.");
      }
    }
  };

  // Hàm chuẩn bị form để Add
  const handleAdd = () => {
    setFormData({
      fullname: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      country: "Vietnam",
      isDefault: false,
    });
    setIsAdding(true);
  };

  // Hàm lưu (Add/Update)
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (formData._id) {
        // Update
        await updateAddress(formData._id, formData);
        alert("Address updated successfully!");
      } else {
        // Add
        await createAddress(formData);
        alert("Address added successfully!");
      }

      onAddressChange(); // Gọi hàm re-fetch từ parent
      setIsAdding(false);

      // Sau khi lưu thành công, nếu địa chỉ vừa lưu được đặt là mặc định, cần cập nhật selectedId
      if (formData.isDefault) {
        // Re-fetch sẽ lo phần này, nên chỉ cần reset form
        setFormData({});
      }
    } catch (error) {
      console.error("Error saving address:", error);
      alert(`Failed to save address: ${error.message}`);
    }
  };

  return (
    <section className="border-t border-gray-200 pt-6">
      <h2 className="text-[20px] font-semibold mb-4">Ship to</h2>

      {/* === ADD/EDIT FORM === */}
      {isAdding ? (
        <form
          onSubmit={handleSave}
          className="border border-gray-300 rounded-lg p-5 mb-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Full name</label>
            <input
              required
              type="text"
              value={formData.fullname} // Sử dụng fullname
              onChange={(e) =>
                setFormData({ ...formData, fullname: e.target.value })
              }
              className="border border-gray-300 rounded-md w-full px-3 py-2 text-sm focus:ring-2 focus:ring-[#3665f3]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Street Address
            </label>
            <input
              required
              type="text"
              value={formData.street} // Sử dụng street
              onChange={(e) =>
                setFormData({ ...formData, street: e.target.value })
              }
              className="border border-gray-300 rounded-md w-full px-3 py-2 text-sm focus:ring-2 focus:ring-[#3665f3]"
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">City</label>
              <input
                required
                type="text"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className="border border-gray-300 rounded-md w-full px-3 py-2 text-sm focus:ring-2 focus:ring-[#3665f3]"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                State/Province
              </label>
              <input
                type="text"
                value={formData.state} // Thêm State
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
                className="border border-gray-300 rounded-md w-full px-3 py-2 text-sm focus:ring-2 focus:ring-[#3665f3]"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Country</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                className="border border-gray-300 rounded-md w-full px-3 py-2 text-sm focus:ring-2 focus:ring-[#3665f3]"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                required
                type="text"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="border border-gray-300 rounded-md w-full px-3 py-2 text-sm focus:ring-2 focus:ring-[#3665f3]"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isDefault"
              checked={formData.isDefault}
              onChange={(e) =>
                setFormData({ ...formData, isDefault: e.target.checked })
              }
              className="w-4 h-4 accent-[#3665f3]"
            />
            <label htmlFor="isDefault" className="text-sm font-medium">
              Set as default shipping address
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-5 py-2 border border-[#3665f3] rounded-full text-[#3665f3] text-sm font-medium hover:bg-blue-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#3665f3] rounded-full text-white text-sm font-medium hover:bg-[#2953c6]"
            >
              Save
            </button>
          </div>
        </form>
      ) : (
        <>
          {/* === ADDRESS LIST === */}
          <div className="space-y-6">
            {addresses.length === 0 ? (
              <p className="text-gray-500 italic">
                No shipping addresses found. Please add one.
              </p>
            ) : (
              addresses.map((addr) => (
                <div
                  key={addr._id} // Sử dụng _id
                  className={`border border-gray-300 rounded-lg p-5 ${
                    selectedAddressId === addr._id ? "bg-blue-50" : "bg-white" // Sử dụng selectedAddressId
                  }`}
                >
                  {/* LABELS */}
                  <div className="flex gap-2 mb-2">
                    {selectedAddressId === addr._id && (
                      <span className="text-xs px-3 py-0.5 bg-[#3665f3] text-white rounded-full font-semibold">
                        SELECTED
                      </span>
                    )}
                    {addr.isDefault && ( // Kiểm tra isDefault
                      <span className="text-xs px-3 py-0.5 bg-gray-200 text-gray-800 rounded-full font-semibold">
                        PRIMARY ADDRESS
                      </span>
                    )}
                  </div>
                  {/* INFO */}
                  <p className="font-medium">{addr.fullname}</p>
                  <p>{addr.street}</p> {/* Sử dụng street */}
                  <p>
                    {addr.city} {addr.state && `, ${addr.state}`}
                  </p>
                  <p>{addr.country}</p>
                  <p>{addr.phone}</p>
                  {/* ACTIONS */}
                  <div className="flex gap-2 mt-2 text-sm">
                    {selectedAddressId !== addr._id && (
                      <button
                        onClick={() => handleSelect(addr._id)}
                        className="text-[#3665f3] hover:underline"
                      >
                        Select
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(addr._id)}
                      className="text-[#3665f3] hover:underline"
                    >
                      Edit
                    </button>
                    {/* Không cho phép xóa nếu đây là địa chỉ mặc định */}
                    {!addr.isDefault && (
                      <button
                        onClick={() => handleDelete(addr._id)}
                        className="text-[#d93025] hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* === BUTTONS === */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleAdd}
              className="px-5 py-2 border border-[#3665f3] rounded-full text-[#3665f3] text-sm font-medium hover:bg-blue-50"
            >
              Add a new address
            </button>
            <button
              onClick={() => setIsAdding(false)} // Thay thế alert bằng hành động đóng form/cancel
              className="px-5 py-2 border border-[#3665f3] rounded-full text-[#3665f3] text-sm font-medium hover:bg-blue-50"
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default ShipTo;
