"use client";
import React, { useState } from "react";
import { Card, Button, Modal, Rate, Input, Select, Tag, Divider, Steps } from "antd";
import { ShoppingOutlined, FileTextOutlined, StarOutlined, SyncOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;

// Fake data cho orders
const FAKE_ORDERS = [
    {
        id: "ORD-2024-001",
        orderDate: "2024-10-15",
        status: "delivered",
        total: 1250000,
        items: [
            {
                id: 1,
                name: "iPhone 15 Pro Max 256GB",
                image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=150&h=150&fit=crop",
                price: 1200000,
                quantity: 1,
                reviewed: false
            },
            {
                id: 2,
                name: "Ốp lưng silicon iPhone 15",
                image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=150&h=150&fit=crop",
                price: 50000,
                quantity: 1,
                reviewed: true
            }
        ],
        trackingSteps: [
            { title: "Đặt hàng", date: "15/10/2024 10:30", completed: true },
            { title: "Xác nhận", date: "15/10/2024 14:20", completed: true },
            { title: "Đang giao", date: "16/10/2024 08:15", completed: true },
            { title: "Đã giao", date: "17/10/2024 16:45", completed: true }
        ]
    },
    {
        id: "ORD-2024-002",
        orderDate: "2024-10-28",
        status: "shipping",
        total: 850000,
        items: [
            {
                id: 3,
                name: "Tai nghe AirPods Pro Gen 2",
                image: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=150&h=150&fit=crop",
                price: 850000,
                quantity: 1,
                reviewed: false
            }
        ],
        trackingSteps: [
            { title: "Đặt hàng", date: "28/10/2024 09:15", completed: true },
            { title: "Xác nhận", date: "28/10/2024 11:30", completed: true },
            { title: "Đang giao", date: "29/10/2024 07:00", completed: true },
            { title: "Đã giao", date: "", completed: false }
        ]
    },
    {
        id: "ORD-2024-003",
        orderDate: "2024-11-01",
        status: "processing",
        total: 2350000,
        items: [
            {
                id: 4,
                name: "MacBook Air M2 2024",
                image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=150&h=150&fit=crop",
                price: 2350000,
                quantity: 1,
                reviewed: false
            }
        ],
        trackingSteps: [
            { title: "Đặt hàng", date: "01/11/2024 14:20", completed: true },
            { title: "Xác nhận", date: "01/11/2024 15:45", completed: true },
            { title: "Đang giao", date: "", completed: false },
            { title: "Đã giao", date: "", completed: false }
        ]
    }
];

const STATUS_CONFIG = {
    processing: { text: "Đang xử lý", color: "blue" },
    shipping: { text: "Đang giao hàng", color: "orange" },
    delivered: { text: "Đã giao hàng", color: "green" },
    cancelled: { text: "Đã hủy", color: "red" },
    refund_requested: { text: "Yêu cầu hoàn trả", color: "purple" }
};

export default function OrderHistory() {
    const [orders, setOrders] = useState(FAKE_ORDERS);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [reviewModal, setReviewModal] = useState({ visible: false, item: null, orderId: null });
    const [refundModal, setRefundModal] = useState({ visible: false, orderId: null });
    const [reviewData, setReviewData] = useState({ rating: 5, comment: "" });
    const [refundData, setRefundData] = useState({ reason: "", description: "" });

    // TODO: Replace with actual API call
    const fetchOrders = async () => {
        // const response = await fetch('/api/orders');
        // const data = await response.json();
        // setOrders(data);
    };

    const handleReviewSubmit = () => {
        // TODO: Replace with actual API call
        // await fetch(`/api/orders/${reviewModal.orderId}/items/${reviewModal.item.id}/review`, {
        //   method: 'POST',
        //   body: JSON.stringify(reviewData)
        // });

        console.log("Submit review:", { ...reviewData, orderId: reviewModal.orderId, itemId: reviewModal.item.id });

        // Update local state
        setOrders(orders.map(order => {
            if (order.id === reviewModal.orderId) {
                return {
                    ...order,
                    items: order.items.map(item =>
                        item.id === reviewModal.item.id ? { ...item, reviewed: true } : item
                    )
                };
            }
            return order;
        }));

        setReviewModal({ visible: false, item: null, orderId: null });
        setReviewData({ rating: 5, comment: "" });
    };

    const handleRefundSubmit = () => {
        // TODO: Replace with actual API call
        // await fetch(`/api/orders/${refundModal.orderId}/refund`, {
        //   method: 'POST',
        //   body: JSON.stringify(refundData)
        // });

        console.log("Submit refund:", { ...refundData, orderId: refundModal.orderId });

        // Update local state
        setOrders(orders.map(order =>
            order.id === refundModal.orderId
                ? { ...order, status: "refund_requested" }
                : order
        ));

        setRefundModal({ visible: false, orderId: null });
        setRefundData({ reason: "", description: "" });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    return (
        <div className="w-[1300px] mx-auto p-4 min-h-screen">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Lịch sử đơn hàng</h1>
            </div>

            {orders.map((order) => (
                <Card
                    key={order.id}
                    className="shadow-sm hover:shadow-md transition-shadow"
                    style={{ marginBottom: 20 }}
                    title={
                        <div className="flex justify-between items-center">
                            <div>
                                <span className="font-semibold text-lg">Đơn hàng #{order.id}</span>
                                <span className="text-gray-500 text-sm ml-3">Ngày đặt: {order.orderDate}</span>
                            </div>
                            <Tag color={STATUS_CONFIG[order.status].color} className="text-sm py-1 px-3">
                                {STATUS_CONFIG[order.status].text}
                            </Tag>
                        </div>
                    }
                    extra={
                        <Button
                            type="link"
                            onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                        >
                            {expandedOrder === order.id ? "Thu gọn" : "Xem chi tiết"}
                        </Button>
                    }
                >
                    {/* Order Items */}
                    <div className="space-y-3">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex items-start gap-4 p-3 bg-white rounded border">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-20 h-20 object-cover rounded"
                                />
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-800">{item.name}</h3>
                                    <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                                    <p className="text-lg font-semibold text-blue-600 mt-1">
                                        {formatPrice(item.price)}
                                    </p>
                                </div>
                                {order.status === "delivered" && !item.reviewed && (
                                    <Button
                                        type="primary"
                                        icon={<StarOutlined />}
                                        onClick={() => setReviewModal({ visible: true, item, orderId: order.id })}
                                    >
                                        Đánh giá
                                    </Button>
                                )}
                                {item.reviewed && (
                                    <Tag color="green" icon={<StarOutlined />}>Đã đánh giá</Tag>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Expanded Details */}
                    {expandedOrder === order.id && (
                        <>
                            <Divider />
                            <div className="mb-4">
                                <h4 className="font-semibold mb-3 text-gray-700">Theo dõi đơn hàng</h4>
                                <Steps
                                    current={order.trackingSteps.filter(s => s.completed).length - 1}
                                    items={order.trackingSteps.map(step => ({
                                        title: step.title,
                                        description: step.date,
                                        status: step.completed ? 'finish' : 'wait'
                                    }))}
                                />
                            </div>
                            <Divider />
                        </>
                    )}

                    {/* Order Summary */}
                    <div className="flex justify-between items-center mt-4 pt-4 border-t">
                        <div className="flex gap-2">
                            {order.status === "delivered" && (
                                <Button
                                    icon={<SyncOutlined />}
                                    onClick={() => setRefundModal({ visible: true, orderId: order.id })}
                                >
                                    Yêu cầu hoàn trả
                                </Button>
                            )}
                            <Button icon={<FileTextOutlined />}>
                                Xem hóa đơn
                            </Button>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-600">Tổng cộng</p>
                            <p className="text-2xl font-bold text-red-600">{formatPrice(order.total)}</p>
                        </div>
                    </div>
                </Card>
            ))}

            {/* Review Modal */}
            <Modal
                title={
                    <div className="flex items-center gap-2">
                        <StarOutlined className="text-yellow-500" />
                        <span>Đánh giá sản phẩm</span>
                    </div>
                }
                open={reviewModal.visible}
                onOk={handleReviewSubmit}
                onCancel={() => {
                    setReviewModal({ visible: false, item: null, orderId: null });
                    setReviewData({ rating: 5, comment: "" });
                }}
                okText="Gửi đánh giá"
                cancelText="Hủy"
                width={600}
            >
                {reviewModal.item && (
                    <div className="space-y-4">
                        <div className="flex gap-3 p-3 bg-gray-50 rounded">
                            <img
                                src={reviewModal.item.image}
                                alt={reviewModal.item.name}
                                className="w-16 h-16 object-cover rounded"
                            />
                            <div>
                                <h4 className="font-medium">{reviewModal.item.name}</h4>
                                <p className="text-sm text-gray-500">{formatPrice(reviewModal.item.price)}</p>
                            </div>
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">Đánh giá của bạn</label>
                            <Rate
                                value={reviewData.rating}
                                onChange={(value) => setReviewData({ ...reviewData, rating: value })}
                                className="text-2xl"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">Nhận xét</label>
                            <TextArea
                                rows={4}
                                placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                                value={reviewData.comment}
                                onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                            />
                        </div>
                    </div>
                )}
            </Modal>

            {/* Refund Modal */}
            <Modal
                title={
                    <div className="flex items-center gap-2">
                        <SyncOutlined className="text-blue-500" />
                        <span>Yêu cầu hoàn trả đơn hàng</span>
                    </div>
                }
                open={refundModal.visible}
                onOk={handleRefundSubmit}
                onCancel={() => {
                    setRefundModal({ visible: false, orderId: null });
                    setRefundData({ reason: "", description: "" });
                }}
                okText="Gửi yêu cầu"
                cancelText="Hủy"
                width={600}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block mb-2 font-medium">Lý do hoàn trả</label>
                        <Select
                            className="w-full"
                            placeholder="Chọn lý do"
                            value={refundData.reason}
                            onChange={(value) => setRefundData({ ...refundData, reason: value })}
                        >
                            <Option value="defective">Sản phẩm bị lỗi/hỏng</Option>
                            <Option value="wrong_item">Giao sai sản phẩm</Option>
                            <Option value="not_as_described">Không đúng mô tả</Option>
                            <Option value="changed_mind">Đổi ý không muốn mua</Option>
                            <Option value="other">Lý do khác</Option>
                        </Select>
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">Mô tả chi tiết</label>
                        <TextArea
                            rows={4}
                            placeholder="Vui lòng mô tả chi tiết vấn đề của bạn..."
                            value={refundData.description}
                            onChange={(e) => setRefundData({ ...refundData, description: e.target.value })}
                        />
                    </div>

                    <div className="bg-blue-50 p-3 rounded">
                        <p className="text-sm text-gray-700">
                            <strong>Lưu ý:</strong> Yêu cầu hoàn trả sẽ được xem xét trong vòng 24-48 giờ.
                            Vui lòng chuẩn bị hình ảnh sản phẩm nếu cần thiết.
                        </p>
                    </div>
                </div>
            </Modal>
        </div>
    );
}