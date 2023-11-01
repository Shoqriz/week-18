import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import revouImage from './assets/revou.png';
import Login from './components/Login';
import Register from './components/Register';
import Todolist from './components/Todolist';
import Admin from './components/Admin'
import { Button, Card, Col, Row, Typography } from 'antd';
import './styles/App.css';

const { Title, Paragraph } = Typography;

const Home = () => {
  return (
    <Row justify="center" align="middle" style={{ height: '100vh' }}>
      <Col span={8}>
        <Card>
          <div className='home-content'>
            <img className='logo' src={revouImage} alt="Logo Revou" />
            <Title level={4}>Welcome To My Simple To-Do List App</Title>
            <Paragraph>Please Login To Access The Website</Paragraph>
            <Link to="/login">
              <Button className="btn" type="primary">
                Login
              </Button>
              <br />
              <br />
            </Link>
            <Paragraph>Please register if you don't have an account</Paragraph>
            <Link to="/register">
              <Button className="btn" type="primary">Register</Button>
            </Link>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/todolist" element={<Todolist />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;