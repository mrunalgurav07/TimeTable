import React, { useState } from 'react';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { Teacher } from '../Components/Page1';
import Lecture from '../Components/Page2/Lecture';
import { ViewSub } from '../Components/Page3';
import { ViewClass } from '../Components/Page4';
import { useNavigate } from 'react-router-dom'; // <-- Import useNavigate

// Import your image
import adminIcon from './../TimeTable/admin.png';  // Adjust path if needed
import LoginPage from '../LoginPage/LoginPage';
import Generate from '../Components/Page5/Generate';

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem('Teacher', 'teacher', <UserOutlined />),
  getItem('Lecture', 'lecture', <DesktopOutlined />),
  getItem('Subject', 'subject', <PieChartOutlined />),
  getItem('Department', 'department', <TeamOutlined />),
  getItem('Time Table', 'timetable', <FileOutlined />),
  getItem('Logout', 'logout', <LogoutOutlined />),
];

const TimeTable = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('teacher');
  const navigate = useNavigate(); // <-- Initialize the navigate function

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const renderContent = () => {
    switch (selectedKey) {
      case 'teacher':
        return <Teacher />;
      case 'lecture':
        return <Lecture />;
      case 'subject':
        return <ViewSub />;
      case 'department':
        return <ViewClass />;
      case 'timetable':
        return <Generate/>;
      case 'logout':
        navigate('/');  // <-- Navigate to login page when logout is clicked
        return <LoginPage />;
      default:
        return <div>Select an option from the menu.</div>;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        style={{ paddingTop: '6px' }}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        {/* Admin image and title above the menu */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: '16px',
          }}
        >
          <img
            src={adminIcon}
            alt="Admin Icon"
            style={{
              width: '29px',
              height: '29px',
              marginRight: collapsed ? 0 : '8px',
              borderRadius: '50%',
            }}
          />
          {!collapsed && (
            <span style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>Admin</span>
          )}
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={['teacher']}
          mode="inline"
          items={items}
          onClick={({ key }) => setSelectedKey(key)}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 16px',
            background: '#002140',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <h1 style={{ margin: 0, fontSize: '20px', color: 'white' }}>
            Time-Table Generator
          </h1>
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
            <Breadcrumb.Item>{selectedKey.replace(/-/g, ' ')}</Breadcrumb.Item>
          </Breadcrumb>
          <div
            style={{
              padding: 20,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {renderContent()}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          {/* Optional footer content */}
        </Footer>
      </Layout>
    </Layout>
  );
};

export default TimeTable;
