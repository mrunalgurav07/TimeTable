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
  getItem('Subject', 'subject', <PieChartOutlined />, [
    getItem('Add Subject', 'view-subject'),
  ]),
  getItem('Class', 'class', <TeamOutlined />, [
    getItem('Add Class', 'view-class'),
  ]),
  getItem('Time Table', 'timetable', <FileOutlined />),
  getItem('Logout', 'logout', <LogoutOutlined />),
];

const TimeTable = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('teacher'); // track selected menu

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Render component based on selected menu key
  const renderContent = () => {
    switch (selectedKey) {
      case 'teacher':
        return <Teacher />;
      case 'lecture':
        return <Lecture />;
      case 'view-subject':
        return <ViewSub/>;
      case 'view-class':
        return <ViewClass />;
      case 'timetable':
        return <div>Time Table Component</div>;
      case 'logout':
        return <div>Logging out...</div>;
      default:
        return <div>Select an option from the menu.</div>;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider style={{ paddingTop: '60px'}} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={['teacher']}
          mode="inline"
          items={items}
          onClick={({ key }) => setSelectedKey(key)} // handle menu click
        />
      </Sider>
      <Layout>
      <Header style={{ padding: '0 16px', background: colorBgContainer, display: 'flex', alignItems: 'center'}}>
        <h1 style={{ margin: 0, fontSize: '20px' }}>Time-Table Generator</h1>
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
