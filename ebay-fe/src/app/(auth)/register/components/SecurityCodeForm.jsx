'use client'
import { useState, useRef, useEffect } from 'react';
import { Button, Typography, Space, Input } from 'antd';
import { LeftOutlined } from '@ant-design/icons';

const { Title, Text, Link } = Typography;

export default function SecurityCodeForm() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(57);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index, value) => {
    // Chỉ cho phép nhập số
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto focus ô tiếp theo
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Xử lý phím Backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newCode = [...code];
    
    for (let i = 0; i < pastedData.length; i++) {
      if (/^\d$/.test(pastedData[i])) {
        newCode[i] = pastedData[i];
      }
    }
    setCode(newCode);
  };

  const handleResend = () => {
    setCountdown(57);
    setCode(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="shadow-sm p-8 w-full max-w-md">
        <Space direction="vertical" size="large" className="w-full">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button 
              type="text" 
              icon={<LeftOutlined />} 
              className="p-0"
            />
            <Title level={3} className="m-0">Enter security code</Title>
          </div>

          {/* Description */}
          <Text type="secondary">
            We sent a security code to <strong>+84 0xxxxxxx14</strong>.
          </Text>

          {/* Code Input Boxes */}
          <div className="flex gap-2 justify-center">
            {code.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                maxLength={1}
                className="w-12 h-12 text-center text-lg font-semibold"
                style={{
                  borderRadius: '8px',
                  borderColor: digit ? '#1890ff' : '#d9d9d9',
                  borderWidth: '2px'
                }}
              />
            ))}
          </div>

          {/* Countdown Text */}
          <Text type="secondary" className="text-center block">
            You can resend the security code in {countdown} seconds.
          </Text>

          {/* Need Help Link */}
          <div className="text-center">
            <Link 
              underline 
              onClick={() => console.log('Need help clicked')}
              className="text-gray-700"
            >
              Need help?
            </Link>
          </div>
        </Space>
      </div>
    </div>
  );
}