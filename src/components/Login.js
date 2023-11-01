import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input, Button, Form, Alert, Card, Row, Col, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

import '../styles/Login.css';

const Login = () => {
  const [form] = Form.useForm();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const values = await form.validateFields();
      const formData = {
        username: values.username,
        password: values.password,
      };

      const response = await fetch('https://w18be.cyclic.app/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        const accessToken = data.accessToken;
        localStorage.setItem('accessToken', accessToken);

        const decodedToken = jwtDecode(accessToken);
        const userRole = decodedToken.role;

        if (userRole === 'user') {
          navigate('/todolist');
        } else if (userRole === 'admin') {
          navigate('/admin');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error);
      }
    } catch (error) {
      setError('An error occurred during login.');
    }
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
      <Col span={8}>
        <Card>
          <Typography.Title level={2}>Login</Typography.Title>
          <Form form={form} onFinish={handleLogin}>
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: 'Please enter your username',
                },
              ]}
            >
              <Input placeholder="Username" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please enter your password',
                },
              ]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
            {error && <Alert message={error} type="error" showIcon />}
            <Form.Item>
              <Button className='btn' type="primary" htmlType="submit">
                Login
              </Button>
            </Form.Item>
          </Form>
          <Typography.Text>
            Don't have an account? <Link to="/register">Register</Link>
          </Typography.Text>
        </Card>
      </Col>
    </Row>
  );
};

export default Login;
