// Lecture.js (Relevant sections only)

import React, { useState, useEffect } from 'react';
import {
  Button, Form, Row, Col, TimePicker, InputNumber, Typography,
  message, Card, Table, Space, Popconfirm, Select, Input
} from 'antd';
import { DeleteOutlined, EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

const format = 'HH:mm';
const { Title } = Typography;

const Lecture = ({ refreshLectureList }) => {
  const [form] = Form.useForm();
  const [lectures, setLectures] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [editValues, setEditValues] = useState({});
  
  const API_BASE_URL = 'http://localhost:5000';

  const dayOptions = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' },
  ];

  useEffect(() => {
    fetchLectures();
  }, []);

  const fetchLectures = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/lectures`);
      if (response.data.success) {
        const fetchedData = response.data.data.map(item => ({
          ...item,
          key: item._id, // Ensure each row has a unique key
          time: item.time // Store time as string for display
        }));
        setLectures(fetchedData);
      } else {
        message.error('Failed to fetch lectures.');
      }
    } catch (error) {
      console.error('Error fetching lectures:', error);
      message.error('An error occurred while fetching lectures.');
    }
  };

  const onFinish = async (values) => {
    try {
      // Ensure time is formatted correctly for backend if it's a RangePicker
      const timeString = values.time ? values.time.format(format) : '';

      const payload = {
        day: values.day,
        subject: values.subject,   // Changed from 'name'
        lecture: values.lecture,   // Changed from 'lectureNumber'
        time: timeString,          // Changed from 'fromTime'
      };

      const response = await axios.post(`${API_BASE_URL}/lectures/create`, payload);
      if (response.data.success) {
        message.success('Lecture added successfully!');
        form.resetFields(); // Clear the form
        fetchLectures(); // Refresh the list
      } else {
        message.error(response.data.message || 'Failed to add lecture.');
      }
    } catch (error) {
      console.error('Error adding lecture:', error);
      message.error('An error occurred while adding lecture.');
    }
  };

  // Editing logic for table
  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    // Convert time string back to dayjs object for TimePicker
    form.setFieldsValue({
      ...record,
      time: record.time ? dayjs(record.time, format) : null,
    });
    setEditingKey(record.key);
    setEditValues(record);
  };

  const cancel = () => {
    setEditingKey('');
    setEditValues({});
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newTime = row.time ? row.time.format(format) : ''; // Format time for update
      const updatedRow = { ...row, time: newTime };

      const response = await axios.put(`${API_BASE_URL}/lectures/${key}`, updatedRow);

      if (response.data.success) {
        message.success('Lecture updated successfully!');
        setEditingKey('');
        setEditValues({});
        fetchLectures(); // Refresh the list
      } else {
        message.error(response.data.message || 'Failed to update lecture.');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
      message.error('Failed to update lecture. Please check your inputs.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/lectures/${id}`);
      if (response.data.success) {
        message.success('Lecture deleted successfully!');
        fetchLectures(); // Refresh the list
      } else {
        message.error(response.data.message || 'Failed to delete lecture.');
      }
    } catch (error) {
      console.error('Error deleting lecture:', error);
      message.error('An error occurred while deleting lecture.');
    }
  };

  // Define table columns
  const columns = [
    {
      title: 'Day',
      dataIndex: 'day',
      key: 'day',
      editable: true,
      render: (text, record) => isEditing(record) ? (
        <Form.Item name="day" rules={[{ required: true }]} style={{ margin: 0 }}>
          <Select options={dayOptions} />
        </Form.Item>
      ) : text,
    },
    {
      title: 'Subject', // Changed from 'Subject & Teacher'
      dataIndex: 'subject', // Changed from 'name'
      key: 'subject',
      editable: true,
      render: (text, record) => isEditing(record) ? (
        <Form.Item name="subject" rules={[{ required: true }]} style={{ margin: 0 }}>
          <Input />
        </Form.Item>
      ) : text,
    },
    {
      title: 'Lecture Number', // Changed from 'Lecture Number' for clarity, but dataIndex is now 'lecture'
      dataIndex: 'lecture', // Changed from 'lectureNumber'
      key: 'lecture',
      editable: true,
      render: (text, record) => isEditing(record) ? (
        <Form.Item name="lecture" rules={[{ required: true }]} style={{ margin: 0 }}>
          <InputNumber min={1} max={6} style={{ width: '100%' }} />
        </Form.Item>
      ) : text,
    },
    {
      title: 'Time', // Changed from 'Time'
      dataIndex: 'time', // Changed from 'fromTime'
      key: 'time',
      editable: true,
      render: (text, record) => isEditing(record) ? (
        <Form.Item name="time" rules={[{ required: true }]} style={{ margin: 0 }}>
          <TimePicker format={format} style={{ width: '100%' }} /> {/* Changed to single TimePicker if only 'fromTime' was needed */}
        </Form.Item>
      ) : text,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Space>
            <Button type="link" onClick={() => save(record.key)} icon={<SaveOutlined />} />
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <Button type="link" icon={<CloseOutlined />} />
            </Popconfirm>
          </Space>
        ) : (
          <Space>
            <Button type="link" disabled={editingKey !== ''} onClick={() => edit(record)} icon={<EditOutlined />} />
            <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
              <Button type="link" disabled={editingKey !== ''} danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <Card title={<Title level={4}>Add New Lecture</Title>} style={{ margin: '20px' }}>
      <Form
        form={form}
        name="addLecture"
        onFinish={onFinish}
        layout="vertical"
        initialValues={{ lecture: 1, time: dayjs('08:00', format) }} // Default time for a single TimePicker
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Day" name="day" rules={[{ required: true }]}>
              <Select options={dayOptions} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Subject" name="subject" rules={[{ required: true }]}>
              <Input placeholder="e.g., Java (SSG)" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Lecture Number" name="lecture" rules={[{ required: true }]}>
              <InputNumber min={1} max={6} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Time" name="time" rules={[{ required: true }]}>
              <TimePicker format={format} style={{ width: '100%' }} /> {/* Changed to single TimePicker */}
            </Form.Item>            
          </Col>
        </Row>
        {/* Removed Department Form.Item as it's not in the desired fields */}
        <Form.Item>
          <Button type="primary" htmlType="submit">Add Lecture</Button>
        </Form.Item>
      </Form>

      {/* Lectures Table */}
      <Card title={<Title level={4}>View Lectures</Title>} style={{ marginTop: '20px' }}>
        <Table
          columns={columns}
          dataSource={lectures}
          rowKey="key"
          pagination={{ pageSize: 10 }}
          bordered
        />
      </Card>
    </Card>
  );
};

export default Lecture;