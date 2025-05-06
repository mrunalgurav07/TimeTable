import React, { useState, useEffect } from 'react';
import { Button, Space, Table, Input, Form, Row, Col, Typography, Popconfirm, message,Card } from 'antd';
import { EditOutlined, SaveOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;

const ViewSub = () => {
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [editingKey, setEditingKey] = useState('');
  const [data, setData] = useState([]);
  const [editName, setEditName] = useState('');
  const [editCode, setEditCode] = useState('');
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });

  // Fetch all subjects from the database when the component mounts
  useEffect(() => {
    axios.get('http://localhost:5000/subjects')
      .then((response) => {
        const fetchedData = response.data.data.map((item, index) => ({
          ...item,
          key: item._id, // Ensure each record has a unique key
          no: index + 1,  // Dynamically assign Sr. No.
        }));
        setData(fetchedData);
      })
      .catch((err) => {
        message.error('Failed to fetch subjects');
        console.error(err);
      });
  }, []);

  // Function to add new subject
  const addSubject = async (values) => {
    try {
      const response = await axios.post('http://localhost:5000/subjects', values);
      const newData = {
        key: response.data.data._id, // MongoDB ID for the key
        no: data.length + 1,  // Dynamically assign Sr. No.
        name: response.data.data.name,
        code: response.data.data.code,
      };
      setData((prevData) => [...prevData, newData]);
      message.success('Subject added successfully!');
      form.resetFields(); // Reset form after submitting
    } catch (err) {
      message.error('Failed to add subject');
      console.error(err);
    }
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

  const save = async (key) => {
    try {
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, name: editName, code: editCode });
        setData(newData);
        setEditingKey('');
        
        // Update in the database
        await axios.put(`http://localhost:5000/subjects/${key}`, { name: editName, code: editCode });
        message.success('Subject updated successfully');
      }
    } catch (err) {
      message.error('Failed to update subject');
      console.error(err);
    }
  };

  const handleDelete = async (key) => {
    try {
      await axios.delete(`http://localhost:5000/subjects/${key}`);
      const newData = data.filter((item) => item.key !== key);
      setData(newData);
      message.success('Subject deleted successfully');
    } catch (err) {
      message.error('Failed to delete subject');
      console.error(err);
    }
  };

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
    setPagination(pagination);
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
      render: (text, record, index) => {
        const currentIndex = (pagination.current - 1) * pagination.pageSize + index + 1;
        return currentIndex;
      },
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
     <div style={{ padding: '20px' }}>
      <Card title={<Title level={4}>Add Subject</Title>} style={{ marginBottom: '20px' }}>
          <Form form={form} layout="vertical" onFinish={addSubject}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Subject Name"
                  name="name"
                  rules={[{ required: true, message: 'Please enter subject!' }]}>
                  <Input placeholder="Enter Subject Name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Subject Code"
                  name="code"
                  rules={[{ required: true, message: 'Please enter subject code!' }]}>
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
      </Card>

      <Card title={<Title level={4}>View Subject</Title>} style={{ marginBottom: '20px' }}>
        <Space style={{ marginBottom: 16 }}>
          <Button onClick={setCodeSort}>Sort code</Button>
          <Button onClick={clearFilters}>Clear filters</Button>
          <Button onClick={clearAll}>Clear filters and sorters</Button>
        </Space>

        <Table
          columns={columns}
          dataSource={data}
          onChange={handleChange}
          pagination={pagination}
          rowKey="key"
        />
        </Card>
      </div>
    </>
  );
};

export default ViewSub;
