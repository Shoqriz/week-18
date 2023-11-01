import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input, Button, Select, Form, Alert, Card, Row, Col, Typography } from 'antd';
import '../styles/Register.css';

const { Option } = Select;

const Register = () => {
  const [form] = Form.useForm();
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleRegister = async () => {
    try {
      const values = await form.validateFields();
      const formData = {
        email: values.email,
        username: values.username,
        password: values.password,
        role: values.role,
      };

      const response = await fetch('https://w18be.cyclic.app/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccessMessage('Registration successful.');
      } else {
        const data = await response.json();
        setError(data.error);
      }
    } catch (error) {
      setError('An error occurred during registration.');
    }
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
      <Col span={8}>
        <Card>
          <Typography.Title level={2}>Register</Typography.Title>
          <Form
            form={form}
            onFinish={handleRegister}
          >
            <Form.Item
              name="email"
              rules={[
                {
                  type: 'email',
                  message: 'Valid email address is required',
                },
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>
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
                {
                  min: 8,
                  message: 'Password must be at least 8 characters long',
                },
                {
                  pattern: /^[a-zA-Z0-9]+$/,
                  message: 'Password must be alphanumeric',
                },
              ]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
            <Form.Item
              name="role"
              rules={[
                {
                  required: true,
                  message: 'Please select your role',
                },
              ]}
            >
              <Select placeholder="Select your role">
                <Option value="user">User</Option>
                <Option value="admin">Admin</Option>
              </Select>
            </Form.Item>
            {error && <Alert message={error} type="error" showIcon />}
            <Form.Item>
              <Button className='btn' type="primary" htmlType="submit">
                Register
              </Button>
            </Form.Item>
          </Form>
          {successMessage && (
            <Alert message={successMessage} type="success" showIcon />
          )}
          <Typography.Text>
            Already have an account? <Link to="/login">Login</Link>
          </Typography.Text>
        </Card>
      </Col>
    </Row>
  );
};

export default Register;
