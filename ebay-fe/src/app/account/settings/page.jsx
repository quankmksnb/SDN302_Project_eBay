"use client";
import { getUserInfo, updateProfile } from "@/services/userService";
import {
  BellOutlined,
  CreditCardOutlined,
  EnvironmentOutlined,
  LockOutlined,
  UserOutlined,
  SaveOutlined,
  CloseOutlined,
  EditOutlined,
  MailOutlined,
  PhoneOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  Input,
  Menu,
  Row,
  Spin,
  Space,
  Divider,
  Typography,
  List,
  Tag,
} from "antd";
import { useEffect, useState } from "react";
import styles from "./AccountSettings.module.scss";

const { Title, Text } = Typography;

// ✅ Custom Toast Component (giữ nguyên)
const Toast = ({ message, type, onClose }) => {
  const icons = {
    success: <CheckCircleOutlined style={{ fontSize: 20 }} />,
    error: <CloseCircleOutlined style={{ fontSize: 20 }} />,
    warning: <ExclamationCircleOutlined style={{ fontSize: 20 }} />,
    info: <InfoCircleOutlined style={{ fontSize: 20 }} />,
  };

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <div className={styles.toastIcon}>{icons[type]}</div>
      <div className={styles.toastContent}>
        <div className={styles.toastTitle}>{message.title}</div>
        {message.description && (
          <div className={styles.toastDescription}>{message.description}</div>
        )}
      </div>
      <Button
        type="text"
        size="small"
        icon={<CloseOutlined />}
        onClick={onClose}
        className={styles.toastClose}
      />
    </div>
  );
};

export default function AccountSettings() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    fullname: "",
    phoneNumber: "",
  });

  // ✅ State mới để kiểm soát tab đang chọn
  const [selectedTab, setSelectedTab] = useState("personal");

  // ✅ Fake data cho Notifications
  const fakeNotifications = {
    orders: [
      { id: 1, title: "Đơn hàng #12345 đã được giao", date: "2025-11-02", status: "delivered" },
      { id: 2, title: "Đơn hàng #12346 đang được xử lý", date: "2025-11-03", status: "processing" },
    ],
    promotions: [
      { id: 3, title: "🎉 Giảm giá 20% cho thành viên Premium", date: "2025-11-01" },
      { id: 4, title: "🛍️ Mua 2 tặng 1 – Chỉ trong hôm nay!", date: "2025-11-04" },
    ],
    feedback: [
      { id: 5, title: "Cảm ơn bạn đã đánh giá sản phẩm!", date: "2025-11-03" },
      { id: 6, title: "Bạn có muốn chia sẻ ý kiến về dịch vụ không?", date: "2025-11-04" },
    ],
  };

  // ✅ Toast helper
  const showToast = (type, title, description) => {
    setToast({ type, message: { title, description } });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (window.location.hash === "#notification") {
      setSelectedTab("notifications");
    }
  }, []);


  const fetchUserData = async () => {
    try {
      setLoading(true);
      const res = await getUserInfo();
      const data = res.data || {};

      if (data.success) {
        setUser(data.user);
        setFormData({
          fullname: data.user.fullname || "",
          phoneNumber: data.user.phoneNumber || "",
        });
        showToast(
          "success",
          "Profile Loaded",
          "Your profile information has been loaded successfully."
        );
      } else {
        showToast(
          "error",
          "Loading Failed",
          data.message || "Failed to fetch user info"
        );
      }
    } catch (error) {
      showToast(
        "error",
        "Connection Error",
        error.response?.data?.message ||
        "Unable to load profile. Please check your connection."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.fullname.trim()) {
      showToast(
        "warning",
        "Validation Error",
        "Full name is required. Please enter your name."
      );
      return;
    }

    try {
      setSaving(true);
      const res = await updateProfile(formData);
      if (res.data?.success || res.message) {
        const updatedUser = res.data?.user || res.user;
        showToast(
          "success",
          "Profile Updated!",
          "Your changes have been saved successfully."
        );

        if (updatedUser) {
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }

        setTimeout(() => {
          fetchUserData();
          setEditing(false);
        }, 1000);
      } else {
        showToast(
          "error",
          "Update Failed",
          res.data?.message || "Failed to update profile."
        );
      }
    } catch (error) {
      showToast(
        "error",
        "Update Error",
        error.response?.data?.message ||
        "Unable to update profile. Please check your connection."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      fullname: user.fullname || "",
      phoneNumber: user.phoneNumber || "",
    });
    setEditing(false);
    showToast("info", "Changes Discarded", "Your changes have been cancelled.");
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Card className={styles.loadingCard}>
          <Spin size="large" />
          <Title level={4} className={styles.loadingTitle}>
            Loading your profile...
          </Title>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.noUserContainer}>
        <Card className={styles.noUserCard}>
          <UserOutlined className={styles.noUserIcon} />
          <Title level={3} className={styles.noUserTitle}>
            Authentication Required
          </Title>
          <Text className={styles.noUserText}>
            Please log in to view your account settings
          </Text>
          <Divider style={{ margin: "32px 0" }} />
          <Button type="primary" size="large" href="/login" block>
            Go to Login
          </Button>
        </Card>
      </div>
    );
  }

  const menuItems = [
    { key: "personal", icon: <UserOutlined />, label: "Personal Info" },
    { key: "notifications", icon: <BellOutlined />, label: "Notifications" },
    { key: "payment", icon: <CreditCardOutlined />, label: "Payment Methods" },
    { key: "security", icon: <LockOutlined />, label: "Security" },
  ];

  return (
    <div className={styles.container}>
      {/* ✅ Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Thông tin người dùng</h1>
      </div>

      <Row gutter={[24, 24]}>
        {/* Sidebar */}
        <Col xs={24} lg={7}>
          <Card className={styles.sidebarCard}>
            <div className={styles.profileSection}>
              <Avatar
                size={100}
                icon={<UserOutlined />}
                src={user.avatarURL || null}
                className={styles.profileAvatar}
              />
              <Title level={3} className={styles.profileName}>
                {user.fullname}
              </Title>
              <Text className={styles.profileEmail}>
                <MailOutlined className={styles.emailIcon} />{" "}
                {user.email || "No email"}
              </Text>
            </div>

            <Menu
              mode="inline"
              selectedKeys={[selectedTab]}
              items={menuItems}
              onClick={(info) => setSelectedTab(info.key)}
            />
          </Card>
        </Col>

        {/* ✅ Main Content */}
        <Col xs={24} lg={17}>
          {selectedTab === "notifications" ? (
            <Card className={styles.mainCard} title="Notifications Center">
              <Title level={4}>🛒 Orders</Title>
              <List
                dataSource={fakeNotifications.orders}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={item.title}
                      description={item.date}
                    />
                    <Tag
                      color={
                        item.status === "delivered" ? "green" : "orange"
                      }
                    >
                      {item.status}
                    </Tag>
                  </List.Item>
                )}
              />
              <Divider />
              <Title level={4}>🎁 Promotions</Title>
              <List
                dataSource={fakeNotifications.promotions}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={item.title}
                      description={item.date}
                    />
                  </List.Item>
                )}
              />
              <Divider />
              <Title level={4}>💬 Feedback</Title>
              <List
                dataSource={fakeNotifications.feedback}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={item.title}
                      description={item.date}
                    />
                  </List.Item>
                )}
              />
            </Card>
          ) : (
            <Card className={styles.mainCard} title="User Information">

              {/* Main Content */}
              <Col xs={24} >
                <Card
                  className={styles.mainCard}
                  title={
                    <div className={styles.cardTitle}>
                      Personal Information
                    </div>
                  }
                  extra={
                    !editing && (
                      <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => setEditing(true)}
                        className={styles.editButton}
                      >
                        Edit
                      </Button>
                    )
                  }
                  styles={{
                    header: {
                      borderBottom: "1px solid #e5e5e5",
                      padding: "16px 24px"
                    },
                    body: {
                      padding: 24
                    }
                  }}
                >
                  <Row gutter={[24, 24]}>
                    <Col xs={24} md={12}>
                      <div className={styles.fieldLabel}>
                        Full Name <span className={styles.required}>*</span>
                      </div>
                      {editing ? (
                        <Input
                          size="large"
                          prefix={<UserOutlined className={styles.prefixIcon} />}
                          value={formData.fullname}
                          onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                          placeholder="Enter your full name"
                          className={styles.inputField}
                        />
                      ) : (
                        <div className={styles.displayField}>
                          {user.fullname || "Not provided"}
                        </div>
                      )}
                    </Col>

                    <Col xs={24} md={12}>
                      <div className={styles.fieldLabel}>
                        Phone Number
                      </div>
                      {editing ? (
                        <Input
                          size="large"
                          prefix={<PhoneOutlined className={styles.prefixIcon} />}
                          value={formData.phoneNumber}
                          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                          placeholder="Enter your phone number"
                          className={styles.inputField}
                        />
                      ) : (
                        <div className={styles.displayField}>
                          {user.phoneNumber || "Not provided"}
                        </div>
                      )}
                    </Col>

                    {editing && (
                      <>
                        <Col xs={24}>
                          <Divider className={styles.divider} />
                        </Col>
                        <Col xs={24}>
                          <Space size="middle" style={{ justifyContent: "flex-end", width: "100%" }}>
                            <Button
                              size="middle"
                              icon={<CloseOutlined />}
                              onClick={handleCancel}
                              disabled={saving}
                              className={styles.cancelButton}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="primary"
                              size="middle"
                              icon={<SaveOutlined />}
                              onClick={handleSave}
                              loading={saving}
                              className={styles.saveButton}
                            >
                              Save
                            </Button>
                          </Space>
                        </Col>
                      </>
                    )}
                  </Row>
                </Card>

                {/* Additional Info Card */}
                <Card
                  className={styles.overviewCard}
                  styles={{
                    body: {
                      padding: 24
                    }
                  }}
                >
                  <Title level={4} className={styles.overviewTitle}>
                    Account Overview
                  </Title>
                  <Row gutter={16}>
                    <Col xs={24} sm={8}>
                      <div className={styles.overviewItem}>
                        <div className={`${styles.overviewIcon} ${styles.overviewIconUser}`}>
                          <UserOutlined />
                        </div>
                        <Text strong className={styles.itemLabel}>
                          Member Since
                        </Text>
                        <Text className={styles.itemValue}>
                          2024
                        </Text>
                      </div>
                    </Col>
                    <Col xs={24} sm={8}>
                      <div className={styles.overviewItem}>
                        <div className={`${styles.overviewIcon} ${styles.overviewIconBell}`}>
                          <BellOutlined />
                        </div>
                        <Text strong className={styles.itemLabel}>
                          Notifications
                        </Text>
                        <Text className={styles.itemValue}>
                          Enabled
                        </Text>
                      </div>
                    </Col>
                    <Col xs={24} sm={8}>
                      <div className={styles.overviewItem}>
                        <div className={`${styles.overviewIcon} ${styles.overviewIconLock}`}>
                          <LockOutlined />
                        </div>
                        <Text strong className={styles.itemLabel}>
                          Security
                        </Text>
                        <Text className={styles.itemValue}>
                          Active
                        </Text>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
}
