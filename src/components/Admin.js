import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Popconfirm, Modal, message, Card } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import '../styles/Admin.css'

const { Column } = Table;

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [userLists, setUserLists] = useState([]);
  const [userModalVisible, setUserModalVisible] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://sz-w18.netlify.app/admin/users', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error('Failed to fetch users:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const fetchUserLists = async (userId) => {
    try {
      const response = await fetch(`https://sz-w18.netlify.app/admin/users/${userId}/lists`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUserLists(data);
      } else {
        console.error('Failed to fetch user lists:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Failed to fetch user lists:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`https://sz-w18.netlify.app/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        message.success('User deleted successfully');
        fetchUsers();
        setUserLists([]);
      } else {
        console.error('Failed to delete user:', response.status, response.statusText);
        message.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
      message.error('An error occurred while deleting the user');
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('https://sz-w18.netlify.app/auth/logout', {
        method: 'GET',
      });

      if (response.ok) {
        localStorage.removeItem('accessToken');
        window.location.href = '/';
      } else {
        console.error('Logout failed:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleViewUserLists = (userId) => {
    fetchUserLists(userId);
    setUserModalVisible(true);
  };

  return (
    <div className='admin'>
        <Button className='btn logout' type="primary" onClick={handleLogout}>Logout</Button>
      <Card title="User List" >
        <Table dataSource={users} rowKey="_id" >
          <Column title="Username" dataIndex="username" key="username" />
          <Column
            title="Action"
            key="action"
            render={(text, record) => (
              <Space size="middle">
                <Button icon={<EyeOutlined />} onClick={() => handleViewUserLists(record._id)}> View Lists </Button>
                <Popconfirm title="Are you sure you want to delete this user?" onConfirm={() => handleDeleteUser(record._id)} okText="Yes" cancelText="No">
                  <Button className='btn' type="danger"> Delete User </Button>
                </Popconfirm>
              </Space>
            )}
          />
        </Table>
      </Card>
      <Modal
        title="User's Lists"
        visible={userModalVisible}
        onCancel={() => setUserModalVisible(false)}
        footer={null}
      >
        <Table dataSource={userLists} rowKey="_id">
          <Column title="Task" dataIndex="task" key="task" />
        </Table>
      </Modal>
    </div>
  );
};

export default Admin;
