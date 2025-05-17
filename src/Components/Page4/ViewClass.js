import React, { useState, useEffect } from 'react';
import { Button, Space, Table, Input, Form, Row, Col, Typography, Popconfirm, message, Card} from 'antd';
import { EditOutlined, SaveOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;

const ViewClass = () => {
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [editingKey, setEditingKey] = useState('');
  const [data, setData] = useState([]);
  const [editName, setEditName] = useState('');
  const [form] = Form.useForm();

  // Fetch all classes from the database when the component mounts
  useEffect(() => {
    axios.get('http://localhost:5000/classes')
      .then((response) => {
        const fetchedData = response.data.data.map((item, index) => ({
          ...item,
          key: item._id, // Ensure each record has a unique key
          no: index + 1,  // Dynamically assign Sr. No.
        }));
        setData(fetchedData);
      })
      .catch((err) => {
        message.error('Failed to fetch Department');
        console.error(err);
      });
  }, []);

  // Function to add new class
  const addClass = async (values) => {
    try {
      const response = await axios.post('http://localhost:5000/classes', { name: values.className });
      const newData = {
        key: response.data.data._id, // MongoDB ID for the key
        no: data.length + 1,  // Dynamically assign Sr. No.
        name: response.data.data.name,
      };
      setData((prevData) => [...prevData, newData]);
      message.success('Department added successfully!');
      form.resetFields(); // Reset form after submitting
    } catch (err) {
      message.error('Failed to add department');
      console.error(err);
    }
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

  const save = async (key) => {
    try {
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, name: editName });
        setData(newData);
        setEditingKey('');
        
        // Update in the database
        await axios.put(`http://localhost:5000/classes/${key}`, { name: editName });
        message.success('Department updated successfully');
      }
    } catch (err) {
      message.error('Failed to update department');
      console.error(err);
    }
  };

  const handleDelete = async (key) => {
    try {
      await axios.delete(`http://localhost:5000/classes/${key}`);
      const newData = data.filter((item) => item.key !== key);
      setData(newData);
      message.success('Department deleted successfully');
    } catch (err) {
      message.error('Failed to delete department');
      console.error(err);
    }
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
      title: 'Department Name',
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
     <div style={{ padding: '20px'}}>
      <Card title={<Title level={4}>Add Department</Title>} style={{ marginBottom: '20px' }}>
        <Form form={form} layout="vertical" onFinish={addClass}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Department Name"
                name="className"
                rules={[{ required: true, message: 'Please enter department!' }]}>
                <Input placeholder="Enter Department Name" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Department
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title={<Title level={4}>View Department</Title>} style={{ marginBottom: '20px' }}>
        <Space style={{ marginBottom: 16 }}>
          <Button onClick={setNoSort}>Sort number</Button>
          <Button onClick={clearFilters}>Clear filters</Button>
          <Button onClick={clearAll}>Clear filters and sorters</Button>
        </Space>

        <Table
          columns={columns}
          dataSource={data}
          onChange={handleChange}
        />
      </Card>
     </div>
    </>
  );
};

export default ViewClass;
