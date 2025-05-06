import React, { useState } from 'react';
import { Button, Checkbox, Form, Input, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Link } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const navigate = useNavigate();  // <-- useNavigate hook

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Mocking the authentication (you can replace this with your backend call)
      const mockUser = { username: 'admin', password: 'admin123' };
      
      if (values.username === mockUser.username && values.password === mockUser.password) {
        message.success('Login successful!');
        navigate('/timetable');  // <-- Navigate to timetable page
      } else {
        message.error('Invalid username or password');
      }
    } catch (error) {
      message.error('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleForgotPassword = () => {
    setIsForgotPassword(true);
  };

  const handleResetPassword = () => {
    message.info('Redirecting to password reset page...');
    // You can navigate to a separate password reset route here if needed
    // navigate('/reset-password');
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #f0f2f5, #cfd9df)',
      }}
    >
      <Card
        style={{ width: 400, padding: '20px 10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
        bordered={false}
      >
        <Title level={3} style={{ textAlign: 'center', marginBottom: 30 }}>
          Admin Login
        </Title>

        <Form
          name="login"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          requiredMark={false}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Username"
              bordered={false}
              style={{
                borderBottom: '1px solid #d9d9d9',
                paddingBottom: '10px',
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              bordered={false}
              style={{
                borderBottom: '1px solid #d9d9d9',
                paddingBottom: '10px',
              }}
            />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Login
            </Button>
          </Form.Item>

          {isForgotPassword ? (
            <div style={{ textAlign: 'center' }}>
              <Button type="link" onClick={handleResetPassword}>Reset Password</Button>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <Link onClick={handleForgotPassword}>Forgot Password?</Link>
            </div>
          )}
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
