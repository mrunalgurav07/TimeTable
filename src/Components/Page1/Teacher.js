import React, { useState, useEffect } from 'react';
import {
  Button, Form, Input, Select, Row, Col, Upload, message,
  Typography, Space, Table, Popconfirm, Card
} from 'antd';
import {
  InboxOutlined, EditOutlined, SaveOutlined, CloseOutlined, DeleteOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;
const { Option } = Select;

const Teacher = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [editRecord, setEditRecord] = useState({});
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setTableLoading(true);
      const response = await axios.get('http://localhost:5000/teachers');
      if (response.data.success) {
        const fetchedData = response.data.data.map((item, index) => ({
          ...item,
          key: item._id,
          no: index + 1,
        }));
        setData(fetchedData);
      } else {
        message.error('Error fetching teachers data');
      }
    } catch (err) {
      message.error('Failed to fetch teachers');
      console.error(err);
    } finally {
      setTableLoading(false);
    }
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle initialValue="91">
      <Select style={{ width: 70 }}>
        <Option value="91">+91</Option>
        <Option value="0231">+0231</Option>
      </Select>
    </Form.Item>
  );

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList ? e.fileList : [];
  };

  const beforeUpload = (file) => {
    const isJpg = file.type === 'image/jpeg';
    if (!isJpg) {
      message.error('You can only upload JPG files!');
    }
    return false; // Prevent automatic upload
  };

  const addTeacher = async (values) => {
    try {
      setLoading(true);
      // Handle image file - in a real app, you'd upload the file to a server and get a URL
      // For this example, we'll just use a placeholder URL
      const teacherData = {
        ...values,
        image: values.image && values.image.length > 0 ? 'placeholder-image-url.jpg' : '',
      };
      
      const response = await axios.post('http://localhost:5000/teachers', teacherData);
      
      if (response.data.success) {
        const newTeacher = {
          ...response.data.data,
          key: response.data.data._id,
          no: data.length + 1,
        };
        setData([...data, newTeacher]);
        message.success('Teacher added successfully!');
        form.resetFields();
      } else {
        message.error('Failed to add teacher: ' + response.data.message);
      }
    } catch (err) {
      message.error('Failed to add teacher: ' + (err.response?.data?.message || err.message));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    setEditingKey(record.key);
    setEditRecord({ ...record });
  };

  const cancel = () => {
    setEditingKey('');
    setEditRecord({});
  };

  const save = async (key) => {
    try {
      const updatedData = [...data];
      const index = updatedData.findIndex((item) => key === item.key);
      
      if (index > -1) {
        // Remove frontend-specific fields before sending to backend
        const { key, no, _id, createdAt, updatedAt, __v, ...dataToUpdate } = editRecord;
        
        const response = await axios.put(`http://localhost:5000/teachers/${key}`, dataToUpdate);
        
        if (response.data.success) {
          // Update local data state
          const item = updatedData[index];
          const updatedItem = { 
            ...item, 
            ...editRecord,
            // Make sure we preserve these fields
            key: item.key,
            no: item.no,
            _id: item._id
          };
          updatedData.splice(index, 1, updatedItem);
          setData(updatedData);
          setEditingKey('');
          message.success('Teacher updated successfully');
        } else {
          message.error('Failed to update: ' + response.data.message);
        }
      }
    } catch (err) {
      message.error('Failed to update teacher: ' + (err.response?.data?.message || err.message));
      console.error(err);
    }
  };

  const handleDelete = async (key) => {
    try {
      const response = await axios.delete(`http://localhost:5000/teachers/${key}`);
      
      if (response.data.success) {
        // Update the data state
        const newData = data.filter((item) => item.key !== key);
        // Re-number the remaining items
        const renumberedData = newData.map((item, index) => ({
          ...item,
          no: index + 1,
        }));
        setData(renumberedData);
        message.success('Teacher deleted successfully');
      } else {
        message.error('Failed to delete: ' + response.data.message);
      }
    } catch (err) {
      message.error('Failed to delete teacher: ' + (err.response?.data?.message || err.message));
      console.error(err);
    }
  };

  const columns = [
    {
      title: 'Sr. No.',
      dataIndex: 'no',
      key: 'no',
      width: '70px',
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text, record) =>
        isEditing(record) ? (
          <Input
            value={editRecord.fullName}
            onChange={(e) => setEditRecord({ ...editRecord, fullName: e.target.value })}
          />
        ) : (
          text
        ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text, record) =>
        isEditing(record) ? (
          <Input
            value={editRecord.email}
            onChange={(e) => setEditRecord({ ...editRecord, email: e.target.value })}
          />
        ) : (
          text
        ),
    },
    {
      title: 'Phone',
      dataIndex: 'mobile',
      key: 'mobile',
      render: (text, record) =>
        isEditing(record) ? (
          <Input
            value={editRecord.mobile}
            onChange={(e) => setEditRecord({ ...editRecord, mobile: e.target.value })}
          />
        ) : (
          text
        ),
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
      render: (text, record) =>
        isEditing(record) ? (
          <Input
            value={editRecord.city}
            onChange={(e) => setEditRecord({ ...editRecord, city: e.target.value })}
          />
        ) : (
          text
        ),
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      render: (text, record) =>
        isEditing(record) ? (
          <Input
            value={editRecord.subject}
            onChange={(e) => setEditRecord({ ...editRecord, subject: e.target.value })}
          />
        ) : (
          text
        ),
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      render: (text, record) =>
        isEditing(record) ? (
          <Select
            value={editRecord.gender}
            onChange={(value) => setEditRecord({ ...editRecord, gender: value })}
            style={{ width: '100%' }}
          >
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
            <Option value="other">Other</Option>
          </Select>
        ) : (
          text && text.charAt(0).toUpperCase() + text.slice(1)
        ),
    },
    {
      title: 'Action',
      key: 'action',
      width: '120px',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Space>
            <Button 
              icon={<SaveOutlined />} 
              type="primary" 
              onClick={() => save(record.key)}
              size="small"
            />
            <Button 
              icon={<CloseOutlined />} 
              onClick={cancel}
              size="small"
            />
          </Space>
        ) : (
          <Space>
            <Button
              icon={<EditOutlined />}
              disabled={editingKey !== ''}
              onClick={() => edit(record)}
              size="small"
              type="primary"
              ghost
            />
            <Popconfirm
              title="Are you sure to delete this teacher?"
              onConfirm={() => handleDelete(record.key)}
              okText="Yes"
              cancelText="No"
            >
              <Button 
                icon={<DeleteOutlined />} 
                danger 
                size="small"
              />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      {/* Form Section */}
      <Card title={<Title level={4}>Add Teacher</Title>} style={{ marginBottom: '20px' }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={addTeacher}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                label="Full Name" 
                name="fullName" 
                rules={[{ required: true, message: 'Please enter full name' }]}
              >
                <Input placeholder="Enter Full Name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="gender" 
                label="Gender" 
                rules={[{ required: true, message: 'Please select gender' }]}
              >
                <Select placeholder="Select Gender">
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="email" 
                label="E-mail" 
                rules={[
                  { type: 'email', message: 'Please enter a valid email' },
                  { required: true, message: 'Please enter email' }
                ]}
              >
                <Input placeholder="Enter Email" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="mobile" 
                label="Phone Number" 
                rules={[{ required: true, message: 'Please enter phone number' }]}
              >
                <Input addonBefore={prefixSelector} placeholder="Enter Phone Number" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="password" 
                label="Password" 
                rules={[{ required: true, message: 'Please enter password' }]} 
                hasFeedback
              >
                <Input.Password placeholder="Enter Password" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="confirm"
                label="Confirm Password"
                dependencies={['password']}
                hasFeedback
                rules={[
                  { required: true, message: 'Please confirm password' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Passwords do not match!'));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Confirm Password" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="city" 
                label="City" 
                rules={[{ required: true, message: 'Please enter city' }]}
              >
                <Input placeholder="Enter City" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="subject" 
                label="Subject" 
                rules={[{ required: true, message: 'Please enter subject' }]}
              >
                <Input placeholder="Enter Subject" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="address" 
                label="Address" 
                rules={[{ required: true, message: 'Please enter address' }]}
              >
                <Input.TextArea 
                  showCount 
                  maxLength={100} 
                  placeholder="Enter Address" 
                  rows={4}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="image"
                label="Image"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[{ required: true, message: 'Please upload an image!' }]}
              >
                <Upload.Dragger
                  name="file"
                  beforeUpload={beforeUpload}
                  accept=".jpg"
                  maxCount={1}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Click or drag a single JPG file to this area to upload</p>
                </Upload.Dragger>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Add Teacher
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* Table Section */}
      <Card 
        title={<Title level={4}>Teachers List</Title>} 
        extra={
          <Button type="primary" onClick={fetchTeachers}>
            Refresh
          </Button>
        }
      >
        <Table 
          columns={columns} 
          dataSource={data} 
          loading={tableLoading}
          rowKey="key"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 'max-content' }}
        />
      </Card>
    </div>
  );
};

export default Teacher;