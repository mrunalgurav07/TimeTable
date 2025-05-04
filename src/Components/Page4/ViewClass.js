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
  { key: '1', no: '1', name: 'MCA-I' },
  { key: '2', no: '2', name: 'MCA-II' },
  { key: '3', no: '3', name: 'BCA-I' },
  { key: '4', no: '4', name: 'BCA-II' },
];

const ViewClass = () => {
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [editingKey, setEditingKey] = useState('');
  const [data, setData] = useState(initialData);
  const [editName, setEditName] = useState('');
  const [form] = Form.useForm();

  // Function to add new class
  const addClass = (values) => {
    const newKey = (data.length + 1).toString(); // Generate new key based on data length
    const newData = {
      key: newKey,
      no: data.length + 1,
      name: values.className,
    };
    setData([...data, newData]);
    message.success('Class added successfully!');
    form.resetFields(); // Reset form after submitting
  };

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    setEditingKey(record.key);
    setEditName(record.name);
  };

  const cancel = () => {
    setEditingKey('');
    setEditName('');
  };

  const save = (key) => {
    const newData = [...data];
    const index = newData.findIndex((item) => key === item.key);
    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, { ...item, name: editName });
      setData(newData);
      setEditingKey('');
      message.success('Class updated successfully');
    }
  };

  const handleDelete = (key) => {
    const newData = data.filter((item) => item.key !== key);
    setData(newData);
    message.success('Class deleted successfully');
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
  const setNoSort = () => {
    setSortedInfo({ order: 'descend', columnKey: 'no' });
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
      title: 'Class Name',
      dataIndex: 'name',
      key: 'name',
      filters: [
        { text: 'MCA', value: 'MCA' },
        { text: 'BCA', value: 'BCA' },
      ],
      filteredValue: filteredInfo.name || null,
      onFilter: (value, record) => record.name.includes(value),
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
            <Button
              size="small"
              icon={<CloseOutlined />}
              onClick={cancel}
            />
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
      {/* Add Class Form */}
      <div style={{ padding: '20px', marginBottom: '20px' }}>
        <Title level={4}>Add Class</Title>
        <Form form={form} layout="vertical" onFinish={addClass}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Class Name"
                name="className"
                rules={[{ required: true, message: 'Please enter class!' }]}
              >
                <Input placeholder="Enter Class Name" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Class
            </Button>
          </Form.Item>
        </Form>
      </div>

      {/* Table Actions */}
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={setNoSort}>Sort number</Button>
        <Button onClick={clearFilters}>Clear filters</Button>
        <Button onClick={clearAll}>Clear filters and sorters</Button>
      </Space>

      {/* Class Table */}
      <Table
        columns={columns}
        dataSource={data}
        onChange={handleChange}
      />
    </>
  );
};

export default ViewClass;
