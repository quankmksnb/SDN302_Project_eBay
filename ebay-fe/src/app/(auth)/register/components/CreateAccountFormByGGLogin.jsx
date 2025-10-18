"use client";
import { useState } from "react";
import { Button, Typography, Space, Divider } from "antd";

const { Title, Text, Link } = Typography;

export default function CreateAccountForm() {
  const [email] = useState("phamhoangduc2004@gmail.com");
  const [userName] = useState("Huy Đoàn");

  const handleCreateAccount = () => {
    console.log("Creating account with:", { email, userName });
  };

  return (
    <div className="min-h-[80vh] bg-white flex justify-center p-4">
      <div className="w-full max-w-md">
        <Space direction="vertical" size="large" className="w-full">
          {/* Header */}
          <div className="text-center">
            <Title level={2} className="m-0">
              Create an account
            </Title>
            <Text type="secondary" className="block mt-2">
              We'll use your Google details to create your eBay account
            </Text>
          </div>

          {/* User Info Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <Space direction="vertical" size="small" className="w-full">
              <div>
                <Text strong>{userName}</Text>
              </div>
              <Text type="secondary" className="text-sm">
                {email}
              </Text>
              <Link underline className="text-blue-600">
                Change
              </Link>
            </Space>
          </div>

          {/* Already using eBay Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <Space direction="vertical" size="small" className="w-full">
              <Text>
                Already using eBay?{" "}
                <Link underline className="text-blue-600">
                  Link to an existing account
                </Link>
              </Text>
            </Space>
          </div>

          {/* Agreement Text */}
          <Text type="secondary" className="text-xs block">
            By creating an account, you agree to our{" "}
            <Link underline className="text-blue-600">
              User Agreement
            </Link>{" "}
            and acknowledge our{" "}
            <Link underline className="text-blue-600">
              User Privacy Notice
            </Link>
            .
          </Text>

          {/* Create Account Button */}
          <Button
            type="primary"
            size="large"
            block
            onClick={handleCreateAccount}
            className="bg-blue-600 hover:bg-blue-700 h-12 rounded-full font-semibold"
          >
            Create account
          </Button>
        </Space>
      </div>
    </div>
  );
}
