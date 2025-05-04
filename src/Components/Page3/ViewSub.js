import React, { useState } from 'react';
import { Button, Space, Table, Input, Form, Row, Col, Typography, Popconfirm, message } from 'antd';
import {
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

const { Title } = Typography;

const initialData = [
  { key: '1', no: '1', name: 'Python', code: 101 },
  { key: '2', no: '2', name: 'Dot Net', code: 102 },
  { key: '3', no: '3', name: 'Java', code: 103 },
  { key: '4', no: '4', name: 'DW', code: 104 },
];

const ViewSub = () => {
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [editingKey, setEditingKey] = useState('');
  const [data, setData] = useState(initialData);
  const [editName, setEditName] = useState('');
  const [editCode, setEditCode] = useState('');
  const [form] = Form.useForm();

  // Function to add new subject
  const addSubject = (values) => {
    const newKey = (data.length + 1).toString(); // Generate new key based on data length
    const newData = {
      key: newKey,
      no: data.length + 1,
      name: values.name,
      code: values.code,
    };
    setData([...data, newData]);
    message.success('Subject added successfully!');
    form.resetFields(); // Reset form after submitting
  };

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    setEditingKey(record.key);
    setEditName(record.name);
    setEditCode(record.code);
  };

  const cancel = () => {
    setEditingKey('');
    setEditName('');
    setEditCode('');
  };

  const save = (key) => {
    const newData = [...data];
    const index = newData.findIndex((item) => key === item.key);
    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, { ...item, name: editName, code: editCode });
      setData(newData);
      setEditingKey('');
      message.success('Subject updated successfully');
    }
  };

  const handleDelete = (key) => {
    const newData = data.filter((item) => item.key !== key);
    setData(newData);
    message.success('Subject deleted successfully');
  };

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const clearFilters = () => setFilteredInfo({});
  const clearAll = () => {
    setFilteredInfo({});
    setSortedInfo({});
  };
  const setCodeSort = () => {
    setSortedInfo({ order: 'descend', columnKey: 'code' });
  };

  const columns = [
    {
      title: 'Sr. no.',
      dataIndex: 'no',
      key: 'no',
      sorter: (a, b) => a.no - b.no,
      sortOrder: sortedInfo.columnKey === 'no' ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: 'Subject Code',
      dataIndex: 'code',
      key: 'code',
      sorter: (a, b) => a.code - b.code,
      sortOrder: sortedInfo.columnKey === 'code' ? sortedInfo.order : null,
      ellipsis: true,
      render: (text, record) =>
        isEditing(record) ? (
          <Input
            size="small"
            value={editCode}
            onChange={(e) => setEditCode(e.target.value)}
            style={{ width: 100 }}
          />
        ) : (
          text
        ),
    },
    {
      title: 'Subject Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
      sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
      ellipsis: true,
      render: (text, record) =>
        isEditing(record) ? (
          <Input
            size="small"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            style={{ width: 120 }}
          />
        ) : (
          text
        ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Space>
            <Button
              size="small"
              type="primary"
              icon={<SaveOutlined />}
              onClick={() => save(record.key)}
            />
            <Button size="small" icon={<CloseOutlined />} onClick={cancel} />
          </Space>
        ) : (
          <Space>
            <Button
              size="small"
              type="default"
              icon={<EditOutlined />}
              disabled={editingKey !== ''}
              onClick={() => edit(record)}
            />
            <Popconfirm
              title="Are you sure to delete?"
              onConfirm={() => handleDelete(record.key)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                size="small"
                type="primary"
                danger
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <div style={{ padding: '20px', marginBottom: '20px' }}>
        <Title level={4}>Add Subject</Title>
        <Form form={form} layout="vertical" onFinish={addSubject}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Subject Name"
                name="name"
                rules={[{ required: true, message: 'Please enter subject!' }]}
              >
                <Input placeholder="Enter Subject Name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Subject Code"
                name="code"
                rules={[{ required: true, message: 'Please enter subject code!' }]}
              >
                <Input placeholder="Enter Subject Code" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Subject
            </Button>
          </Form.Item>
        </Form>
      </div>

      <Space style={{ marginBottom: 16 }}>
        <Button onClick={setCodeSort}>Sort code</Button>
        <Button onClick={clearFilters}>Clear filters</Button>
        <Button onClick={clearAll}>Clear filters and sorters</Button>
      </Space>

      <Table
        columns={columns}
        dataSource={data}
        onChange={handleChange}
      />
    </>
  );
};

export default ViewSub;
