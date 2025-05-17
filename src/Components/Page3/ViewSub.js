import React, { useState, useEffect } from 'react';
import {
  Button, Space, Table, Input, Form, Row, Col,
  Typography, Popconfirm, message, Card
} from 'antd';
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
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('http://localhost:5000/subjects');
      const fetchedData = response.data.data.map((item, index) => ({
        ...item,
        key: item._id,
        no: index + 1,
      }));
      setData(fetchedData);
    } catch (err) {
      message.error('Failed to fetch subjects');
      console.error(err);
    }
  };

  const addSubject = async (values) => {
    try {
      const response = await axios.post('http://localhost:5000/subjects', values);
      const newData = {
        key: response.data.data._id,
        no: data.length + 1,
        name: response.data.data.name,
        code: response.data.data.code,
      };
      setData([...data, newData]);
      message.success('Subject added successfully!');
      form.resetFields();
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
  };

  const save = async (key) => {
    try {
      const updated = [...data];
      const index = updated.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = updated[index];
        const updatedItem = { ...item, name: editName, code: editCode };
        updated.splice(index, 1, updatedItem);
        setData(updated);
        setEditingKey('');

        await axios.put(`http://localhost:5000/subjects/${key}`, {
          name: editName,
          code: editCode,
        });

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
  const setCodeSort = () => setSortedInfo({ order: 'descend', columnKey: 'code' });

  const columns = [
    {
      title: 'Sr. No.',
      dataIndex: 'no',
      key: 'no',
      sorter: (a, b) => a.no - b.no,
      sortOrder: sortedInfo.columnKey === 'no' ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: 'Subject Class & Code',
      dataIndex: 'code',
      key: 'code',
      sorter: (a, b) => a.code.localeCompare(b.code),
      sortOrder: sortedInfo.columnKey === 'code' ? sortedInfo.order : null,
      ellipsis: true,
      filters: [
        {
          text: 'MCA',
          value: 'MCA',
          children: [
            { text: 'MCA-I', value: 'MCA-I' },
            { text: 'MCA-II', value: 'MCA-II' },
          ],
        },
        {
          text: 'BCA',
          value: 'BCA',
          children: [
            { text: 'BCA-I', value: 'BCA-I' },
            { text: 'BCA-II', value: 'BCA-II' },
          ],
        },
      ],
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) =>
        (record.code?.split(' ')[0] || '').toUpperCase() === value.toUpperCase(),
      render: (text, record) =>
        isEditing(record) ? (
          <Input
            value={editCode}
            onChange={(e) => setEditCode(e.target.value)}
            size="small"
            style={{ width: 140 }}
          />
        ) : (
          text
        ),
    },
    {
      title: 'Subject Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
      ellipsis: true,
      render: (text, record) =>
        isEditing(record) ? (
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            size="small"
            style={{ width: 140 }}
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
              type="primary"
              size="small"
              icon={<SaveOutlined />}
              onClick={() => save(record.key)}
            />
            <Button size="small" icon={<CloseOutlined />} onClick={cancel} />
          </Space>
        ) : (
          <Space>
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => edit(record)}
              disabled={editingKey !== ''}
            />
            <Popconfirm
              title="Are you sure to delete this subject?"
              onConfirm={() => handleDelete(record.key)}
              okText="Yes"
              cancelText="No"
            >
              <Button icon={<DeleteOutlined />} danger size="small" />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  

  return (
    <div style={{ padding: '20px' }}>
      <Card title={<Title level={4}>Add Subject</Title>} style={{ marginBottom: '20px' }}>
        <Form form={form} layout="vertical" onFinish={addSubject}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Subject & Teacher Name"
                name="name"
                rules={[{ required: true, message: 'Please enter subject & teacher!' }]}
              >
                <Input placeholder="e.g., Java (SSG)" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Subject Class & Code"
                name="code"
                rules={[{ required: true, message: 'Please enter class & code!' }]}
              >
                <Input placeholder="e.g., MCA-I JAVA101" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit">Add Subject</Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title={<Title level={4}>View Subjects</Title>}>
        <Space style={{ marginBottom: 16 }}>
          <Button onClick={setCodeSort}>Sort by Code</Button>
          <Button onClick={clearFilters}>Clear Filters</Button>
          <Button onClick={clearAll}>Reset All</Button>
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
  );
};

export default ViewSub;
