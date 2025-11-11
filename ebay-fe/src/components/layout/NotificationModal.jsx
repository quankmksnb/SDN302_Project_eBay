"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const mockNotifications = [
  {
    id: 1,
    title: "Đơn hàng #1234 đã giao thành công 🎉",
    message: "Cảm ơn bạn đã mua hàng! Hãy đánh giá sản phẩm của bạn nhé.",
    time: "5 phút trước",
    unread: true,
    icon: "/icons/package.svg",
  },
  {
    id: 2,
    title: "Sản phẩm yêu thích giảm 20%",
    message: "Giày Nike Air Jordan bạn theo dõi đang giảm giá.",
    time: "1 giờ trước",
    unread: true,
    icon: "/icons/discount.svg",
  },
  {
    id: 3,
    title: "Cập nhật bảo mật tài khoản",
    message: "Hãy xác nhận địa chỉ email mới của bạn.",
    time: "Hôm qua",
    unread: false,
    icon: "/icons/shield.svg",
  },
  {
    id: 4,
    title: "Tin tức eBay",
    message: "Cập nhật chính sách mới về hoàn tiền.",
    time: "2 ngày trước",
    unread: false,
    icon: "/icons/info.svg",
  },
  {
    id: 5,
    title: "Voucher đặc biệt 🎁",
    message: "Bạn nhận được voucher 50k cho đơn hàng đầu tiên hôm nay!",
    time: "3 ngày trước",
    unread: false,
    icon: "/icons/gift.svg",
  },
];

export default function NotificationModal({ isOpen, onClose }) {
  const [notifications] = useState([]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          onMouseLeave={onClose}
          className="absolute right-0 top-[120%] w-[340px] bg-white shadow-xl rounded-2xl border border-gray-200 z-50"
        >
          {notifications.length === 0 ? (
            <>
              <div className="p-3 border-b border-gray-100 font-semibold text-gray-800 flex justify-between items-center">
                Thông báo
              </div>
              <div className="max-h-[360px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                <div className="text-sm text-gray-800 font-medium italic text-center py-[30px]">
                  You currently have no notifications.
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="p-3 border-b border-gray-100 font-semibold text-gray-800 flex justify-between items-center">
                Thông báo
                <span className="text-xs text-blue-600 cursor-pointer hover:underline">
                  Đánh dấu đã đọc
                </span>
              </div>

              <div className="max-h-[360px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {notifications.map((noti) => (
                  <div
                    key={noti.id}
                    className={`flex gap-3 items-start p-3 hover:bg-gray-50 cursor-pointer transition ${
                      noti.unread ? "bg-blue-50" : ""
                    }`}
                  >
                    <Image
                      src={noti.icon || "/icons/bell.svg"}
                      width={24}
                      height={24}
                      alt=""
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="text-sm text-gray-800 font-medium">
                        {noti.title}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {noti.message}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {noti.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
