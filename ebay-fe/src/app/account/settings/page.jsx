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
  CloseCircleOutlined
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
} from "antd";
import { useEffect, useState } from "react";
import styles from './AccountSettings.module.scss';

const { Title, Text } = Typography;

// Custom Toast Component
const Toast = ({ message, type, onClose }) => {
  const icons = {
    success: <CheckCircleOutlined style={{ fontSize: 20 }} />,
    error: <CloseCircleOutlined style={{ fontSize: 20 }} />,
    warning: <ExclamationCircleOutlined style={{ fontSize: 20 }} />,
    info: <InfoCircleOutlined style={{ fontSize: 20 }} />
  };

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <div className={styles.toastIcon}>
        {icons[type]}
      </div>
      <div className={styles.toastContent}>
        <div className={styles.toastTitle}>
          {message.title}
        </div>
        {message.description && (
          <div className={styles.toastDescription}>
            {message.description}
          </div>
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

  // Toast helper function
  const showToast = (type, title, description) => {
    setToast({ type, message: { title, description } });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const res = await getUserInfo();
      const data = res.data || {};

      console.log("Fetched user data:", data);
      
      if (data.success) {
        setUser(data.user);
        setFormData({
          fullname: data.user.fullname || "",
          phoneNumber: data.user.phoneNumber || "",
        });
        
        showToast('success', 'Profile Loaded', 'Your profile information has been loaded successfully.');
      } else {
        showToast('error', 'Loading Failed', data.message || "Failed to fetch user info");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      showToast('error', 'Connection Error', error.response?.data?.message || "Unable to load profile. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Validation
    if (!formData.fullname.trim()) {
      showToast('warning', 'Validation Error', 'Full name is required. Please enter your name.');
      return;
    }

    try {
      setSaving(true);
      const res = await updateProfile(formData);
      
      if (res.data?.success || res.message) {
        const updatedUser = res.data?.user || res.user;
        
        showToast('success', 'Profile Updated!', 'Your changes have been saved successfully.');

        // Cập nhật localStorage
        if (updatedUser) {
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }

        // Delay để user nhìn thấy toast
        setTimeout(() => {
          fetchUserData();
          setEditing(false);
        }, 1000);
        
      } else {
        showToast('error', 'Update Failed', res.data?.message || "Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      showToast('error', 'Update Error', error.response?.data?.message || "Unable to update profile. Please check your connection.");
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
    
    showToast('info', 'Changes Discarded', 'Your changes have been cancelled.');
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
          <Button 
            type="primary" 
            size="large" 
            href="/login" 
            block
            className={styles.loginButton}
          >
            Go to Login
          </Button>
        </Card>
      </div>
    );
  }

  const menuItems = [
    { key: "personal", icon: <UserOutlined />, label: "Personal Info" },
    { key: "address", icon: <EnvironmentOutlined />, label: "Addresses" },
    { key: "payment", icon: <CreditCardOutlined />, label: "Payment Methods" },
    { key: "security", icon: <LockOutlined />, label: "Security" },
    { key: "notifications", icon: <BellOutlined />, label: "Notifications" },
  ];

  return (
    <div className={styles.container}>
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      <div className={styles.mainWrapper}>
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
                  <MailOutlined className={styles.emailIcon} /> {user.email || "No email"}
                </Text>
              </div>

              <Menu
                mode="inline"
                defaultSelectedKeys={["personal"]}
                items={menuItems}
                className={styles.menu}
                onClick={(info) => {
                  console.log('Menu clicked:', info.key);
                }}
              />
            </Card>
            
            {/* eBay-style promotional box */}
            <Card className={styles.promoCard}>
              <div className={styles.promoContent}>
                <Title level={4} className={styles.promoTitle}>
                  💎 Upgrade to Premium
                </Title>
                <Text className={styles.promoText}>
                  Get exclusive benefits and priority support
                </Text>
                <Button 
                  size="middle"
                  className={styles.learnMoreButton}
                  block
                >
                  Learn More
                </Button>
              </div>
            </Card>
          </Col>

          {/* Main Content */}
          <Col xs={24} lg={17}>
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
        </Row>
      </div>
    </div>
  );
}