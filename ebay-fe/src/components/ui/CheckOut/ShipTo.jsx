"use client";
import React, { useState } from "react";

const ShipTo = () => {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: "duy anh",
      address: "đống đa, đại học công đoàn",
      city: "Hà Nội, Việt Nam 000084",
      country: "Vietnam",
      phone: "0984432509",
      isPrimary: true,
    },
    {
      id: 2,
      name: "duy anh dinh",
      address: "Nam Từ Liêm, Xuân Phương",
      city: "Hà Nội 1918906",
      country: "Vietnam",
      phone: "0984432509",
      isPrimary: false,
    },
  ]);

  const [selectedId, setSelectedId] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    country: "Vietnam",
    phone: "",
  });

  const handleSelect = (id) => {
    setSelectedId(id);
  };

  const handleEdit = (id) => {
    const addr = addresses.find((a) => a.id === id);
    setFormData(addr);
    setIsAdding(true);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this address?")) {
      setAddresses(addresses.filter((a) => a.id !== id));
      if (selectedId === id && addresses.length > 1)
        setSelectedId(addresses[0].id);
    }
  };

  const handleAdd = () => {
    setFormData({
      name: "",
      address: "",
      city: "",
      country: "Vietnam",
      phone: "",
    });
    setIsAdding(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (formData.id) {
      // update
      setAddresses((prev) =>
        prev.map((a) => (a.id === formData.id ? { ...formData } : a))
      );
    } else {
      // add
      setAddresses((prev) => [
        ...prev,
        { ...formData, id: Date.now(), isPrimary: false },
      ]);
    }
    setIsAdding(false);
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
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="border border-gray-300 rounded-md w-full px-3 py-2 text-sm focus:ring-2 focus:ring-[#3665f3]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input
              required
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="border border-gray-300 rounded-md w-full px-3 py-2 text-sm focus:ring-2 focus:ring-[#3665f3]"
            />
          </div>
          <div>
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
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`border border-gray-300 rounded-lg p-5 ${
                  selectedId === addr.id ? "bg-blue-50" : "bg-white"
                }`}
              >
                {/* LABELS */}
                <div className="flex gap-2 mb-2">
                  {selectedId === addr.id && (
                    <span className="text-xs px-3 py-0.5 bg-[#3665f3] text-white rounded-full font-semibold">
                      SELECTED
                    </span>
                  )}
                  {addr.isPrimary && (
                    <span className="text-xs px-3 py-0.5 bg-gray-200 text-gray-800 rounded-full font-semibold">
                      PRIMARY ADDRESS
                    </span>
                  )}
                </div>

                {/* INFO */}
                <p className="font-medium">{addr.name}</p>
                <p>{addr.address}</p>
                <p>{addr.city}</p>
                <p>{addr.country}</p>
                <p>{addr.phone}</p>

                {/* ACTIONS */}
                <div className="flex gap-2 mt-2 text-sm">
                  {selectedId !== addr.id && (
                    <button
                      onClick={() => handleSelect(addr.id)}
                      className="text-[#3665f3] hover:underline"
                    >
                      Select
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(addr.id)}
                    className="text-[#3665f3] hover:underline"
                  >
                    Edit
                  </button>
                  {!addr.isPrimary && (
                    <button
                      onClick={() => handleDelete(addr.id)}
                      className="text-[#d93025] hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
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
              onClick={() => alert(`Using address ID: ${selectedId}`)}
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
