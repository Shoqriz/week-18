import React, { useState, useEffect } from 'react';
import { Button, Input, List, Typography, Form, message, Card, Space, Modal, Row } from 'antd';
import '../styles/Todolist.css';

const { Title } = Typography;

const Todolist = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ task: '' });
  const [editingTask, setEditingTask] = useState(null);
  const [form] = Form.useForm();

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:3000/user/tasks', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        console.error('Failed to fetch tasks:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (values) => {
    try {
      const response = await fetch('http://localhost:3000/user/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(values),
        credentials: 'include',
      });

      if (response.ok) {
        form.resetFields();
        fetchTasks();
        setNewTask({ task: '' });
        message.success('Task created successfully');
      } else {
        console.error('Failed to create a task:', response.status, response.statusText);
        message.error('Failed to create a task');
      }
    } catch (error) {
      console.error('Failed to create a task:', error);
      message.error('An error occurred while creating the task');
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setNewTask({
      task: task.task,
    });
  };

  const handleUpdateTask = async (values) => {
    try {
      const response = await fetch(`http://localhost:3000/user/tasks/${editingTask._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(values),
        credentials: 'include',
      });

      if (response.ok) {
        const updatedTasks = tasks.map((task) => {
          if (task._id === editingTask._id) {
            return { ...task, task: values.task };
          }
          return task;
        });
        setTasks(updatedTasks);

        setEditingTask(null);
        setNewTask({ task: '' });
        message.success('Task updated successfully');
      } else {
        console.error('Failed to update the task:', response.status, response.statusText);
        message.error('Failed to update the task');
      }
    } catch (error) {
      console.error('Failed to update the task:', error);
      message.error('An error occurred while updating the task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:3000/user/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        fetchTasks(); 
        message.success('Task deleted successfully');
      } else {
        console.error('Failed to delete the task:', response.status, response.statusText);
        message.error('Failed to delete the task');
      }
    } catch (error) {
      console.error('Failed to delete the task:', error);
      message.error('An error occurred while deleting the task');
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:3000/user/tasks/complete/${taskId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        fetchTasks(); 
        message.success('Task marked as completed');
      } else {
        console.error('Failed to complete the task:', response.status, response.statusText);
        message.error('Failed to complete the task');
      }
    } catch (error) {
      console.error('Failed to complete the task:', error);
      message.error('An error occurred while marking the task as completed');
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3000/auth/logout', {
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

  return (
    <div className="todolist-container center-horizontal">
      <Button className='btn logout' type="primary" onClick={handleLogout}>Logout</Button>
      <Title style={{ color: 'white' }} level={2}>To-Do List</Title>
      <Space direction="vertical" size="large">
        <Row justify="center" align="middle">
          <Card className='card' title="Create New Task" bordered={true} style={{ width: '1000px' }}>
            <Form form={form} onFinish={handleCreateTask}>
              <Form.Item
                name="task"
                rules={[
                  {
                    required: true,
                    message: 'Please enter the task description',
                  },
                ]}
              >
                <Input
                  type="text"
                  placeholder="Task"
                  value={newTask.task}
                  onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
                />
              </Form.Item>
              <Space size="middle">
                <Button className='btn' type="primary" htmlType="submit">
                  Create Task
                </Button>
              </Space>
            </Form>
          </Card>
        </Row>
        <Row justify="center" align="middle">
          <Card className='card' title="Your Tasks" bordered={true} style={{ width: '1000px' }}>
            <List className='item'
              dataSource={tasks}
              renderItem={(task) => (
                <List.Item>
                  <div className={`task-content ${task.completed ? 'completed' : ''}`}>
                    {task.task}
                  </div>
                  <Space size="middle">
                    <Button className='btn-cpt' onClick={() => handleCompleteTask(task._id)}>
                      Complete
                    </Button>
                    <Button className='btn' onClick={() => handleEditTask(task)}>
                      Edit
                    </Button>
                    <Button className='btn-dlt' onClick={() => handleDeleteTask(task._id)}>
                      Delete
                    </Button>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Row>
      </Space>
      <Modal title="Edit Task" visible={!!editingTask} onCancel={() => setEditingTask(null)} footer={null}>
        <Form form={form} onFinish={handleUpdateTask}>
          <Form.Item
            name="task"
            rules={[
              {
                required: true,
                message: 'Please enter the task description',
              },
            ]}
          >
            <Input
              type="text"
              placeholder="Task"
              value={newTask.task}
              onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
            />
          </Form.Item>
          <Space size="middle">
            <Button className='btn' type="primary" htmlType="submit">
              Update Task
            </Button>
            <Button className='btn' onClick={() => setEditingTask(null)}>
              Cancel
            </Button>
          </Space>
        </Form>
      </Modal>
    </div>
  );
};

export default Todolist;