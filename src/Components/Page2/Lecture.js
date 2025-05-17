// Import necessary libraries
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

/**
 * Lecture component - Manages lecture CRUD operations
 * @param {Object} props - Component props
 * @param {Function} props.refreshLectureList - Function to refresh lecture list in parent component
 * @returns {JSX.Element} - Lecture management component
 */
const Lecture = ({ refreshLectureList }) => {
  // Initialize form and state
  const [form] = Form.useForm();
  const [lectures, setLectures] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [editValues, setEditValues] = useState({});
  
  // API base URL - Should be moved to environment variable in production
  const API_BASE_URL = 'http://localhost:5000';

  // Day options for dropdown
  const dayOptions = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
  ];

  // Day options for dropdown
  const deptOptions = [
    { value: 'mca-I', label: 'MCA-I' },
    { value: 'mca-II', label: 'MCA-II' },
    { value: 'bca-I', label: 'BCA-I' },
    { value: 'bca-II', label: 'BCA-II' },
  ];

  // Fetch lectures when component mounts
  useEffect(() => {
    fetchLectures();
  }, []);

  /**
   * Fetches lectures from the API
   */
  const fetchLectures = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/lectures`);
      const fetchedLectures = response.data.data || [];
      // Format lectures for display
      const formatted = fetchedLectures.map((lecture) => ({
        ...lecture,
        key: lecture._id, // Use MongoDB _id as key
        day: lecture.day?.name || lecture.day, // Handle if populated or just string
        name: lecture.name || `${lecture.subject?.name || ''} (${lecture.teacher?.name || ''})`
      }));
      setLectures(formatted);
    } catch (err) {
      console.error('Error fetching lectures:', err);
      message.error('❌ Failed to fetch lectures');
    }
  };

  /**
   * Handles form submission to create a new lecture
   * @param {Object} values - Form values
   */
  const onFinish = async (values) => {
    try {
      // Prepare payload with formatted time values
      const payload = {
        day: values.day,
        name: values.name,
        lectureNumber: values.lectureNumber,
        fromTime: values.fromTime.format('HH:mm'),
      };

      // Send request to create lecture
      const res = await axios.post(`${API_BASE_URL}/lectures/create`, payload);

      if (res.data.success) {
        message.success('✅ Lecture added successfully!');
        form.resetFields(); // Reset form
        fetchLectures(); // Refresh lecture list
        // If parent component provided a refresh function, call it
        if (refreshLectureList) {
          refreshLectureList();
        }
      } else {
        message.error(res.data.message || '❌ Failed to add lecture');
      }
    } catch (err) {
      console.error('Error adding lecture:', err);
      message.error('❌ Server error. Please try again.');
    }
  };

  /**
   * Handles lecture deletion
   * @param {string} id - Lecture ID to delete
   */
  const handleDelete = async (id) => {
    try {
      console.log('Deleting lecture with ID:', id);
      
      // Send DELETE request to API
      const response = await axios.delete(`${API_BASE_URL}/lectures/${id}`);
      
      if (response.data.success) {
        // Update the local state to remove the deleted item
        setLectures(prevLectures => prevLectures.filter(item => item._id !== id));
        
        message.success('✅ Lecture deleted successfully');
        
        // Force refetch all lectures to ensure UI is in sync with database
        fetchLectures();
        
        // Refresh lecture list in parent component if available
        if (refreshLectureList) {
          refreshLectureList();
        }
      } else {
        message.error(response.data.message || '❌ Failed to delete lecture');
      }
    } catch (err) {
      console.error('Error deleting lecture:', err);
      message.error('❌ Failed to delete lecture. Please try again.');
    }
  };

  /**
   * Checks if a record is currently being edited
   * @param {Object} record - Table record
   * @returns {boolean} - True if record is being edited
   */
  const isEditing = (record) => record.key === editingKey;

  /**
   * Sets a record for editing
   * @param {Object} record - Table record to edit
   */
  const edit = (record) => {
    setEditingKey(record.key);
    setEditValues({ ...record });
  };

  /**
   * Cancels editing mode
   */
  const cancel = () => {
    setEditingKey('');
    setEditValues({});
  };

  /**
   * Saves updated record
   * @param {string} key - Record key/ID
   */
  const save = async (key) => {
    try {
      const updatedData = { ...editValues };
      const response = await axios.put(`${API_BASE_URL}/lectures/${key}`, updatedData);
      
      if (response.data.success) {
        setEditingKey('');
        fetchLectures();
        message.success('✅ Lecture updated successfully');
      } else {
        message.error(response.data.message || '❌ Failed to update lecture');
      }
    } catch (err) {
      console.error('Error updating lecture:', err);
      message.error('❌ Failed to update lecture. Please try again.');
    }
  };

  const startTime = dayjs('09:00', 'HH:mm');
  const endTime = dayjs('10:00', 'HH:mm');

  // Table columns configuration
  const columns = [
    {
      title: 'Day',
      dataIndex: 'day',
      key: 'day',
      render: (_, record) => isEditing(record) ? (
        <Select
          value={editValues.day}
          onChange={(value) => setEditValues({ ...editValues, day: value })}
          options={dayOptions}
        />
      ) : (
        record.day?.charAt(0).toUpperCase() + record.day?.slice(1)
      ),
    },
    {
      title: 'Subject & Teacher',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => isEditing(record) ? (
        <Input
          value={editValues.name}
          onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
        />
      ) : record.name,
    },
    {
      title: 'Lecture Number',
      dataIndex: 'lectureNumber',
      key: 'lectureNumber',
      render: (_, record) => isEditing(record) ? (
        <InputNumber
          min={1}
          max={6}
          value={editValues.lectureNumber}
          onChange={(value) => setEditValues({ ...editValues, lectureNumber: value })}
        />
      ) : record.lectureNumber,
    },
    {
      title: 'Time',
      dataIndex: 'fromTime',
      key: 'fromTime',
      render: (_, record) => isEditing(record) ? (
        <TimePicker
          format="HH:mm"
          value={editValues.fromTime ? dayjs(editValues.fromTime, 'HH:mm') : null}
          onChange={(time) =>
            setEditValues({ ...editValues, fromTime: time ? time.format('HH:mm') : null })
          }
        />
      ) : record.fromTime,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Space>
            <Button size="small" type="primary" icon={<SaveOutlined />} onClick={() => save(record.key)} />
            <Button size="small" icon={<CloseOutlined />} onClick={cancel} />
          </Space>
        ) : (
          <Space>
            <Button size="small" type="default" icon={<EditOutlined />} onClick={() => edit(record)} />
            <Popconfirm 
              title="Are you sure you want to delete this lecture?" 
              onConfirm={() => handleDelete(record.key)} 
              okText="Yes" 
              cancelText="No"
            >
              <Button size="small" type="primary" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      {/* Add Lecture Form */}
      <Card title={<Title level={4}>Add Lecture</Title>} style={{ marginBottom: '20px' }}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Day" name="day" rules={[{ required: true }]}>
                <Select options={dayOptions} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Subject & Teacher" name="name" rules={[{ required: true }]}>
                <Input placeholder="e.g., Java (SSG)" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Lecture Number" name="lectureNumber" rules={[{ required: true }]}>
                <InputNumber min={1} max={6} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Time" name="fromTime" rules={[{ required: true }]}>
                <TimePicker.RangePicker defaultValue={[startTime, endTime]} format={format} style={{ width: '100%' }} />
              </Form.Item>            
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Department" name="department" rules={[{ required: true }]}>
                <Select options={deptOptions} />
              </Form.Item>
            </Col>
            <Col span={12}>

            </Col>
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit">Add Lecture</Button>
          </Form.Item>
        </Form>
      </Card>

      {/* Lectures Table */}
      <Card title={<Title level={4}>View Lectures</Title>}>
                  <Table
          columns={columns}
          dataSource={lectures}
          rowKey="key"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default Lecture;