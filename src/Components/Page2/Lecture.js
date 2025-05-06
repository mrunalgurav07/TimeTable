import React from 'react';
import { Button, Form, Row, Col, TimePicker, InputNumber, Typography, message,Card } from 'antd';
import axios from 'axios';

const { Title } = Typography;

const Lecture = ({ refreshLectureList }) => {  // add optional prop for refreshing lecture list
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const payload = {
        lectureNumber: values.lectureNumber,
        duration: values.duration.format('HH:mm'),
        fromTime: values.fromTime.format('HH:mm'),
        toTime: values.toTime.format('HH:mm'),
      };

      const res = await axios.post('http://localhost:5000/lecture/create', payload);

      if (res.data.success) {
        message.success('✅ Lecture added successfully!');
        window.alert('Lecture data saved in the database!');
        form.resetFields();
        if (refreshLectureList) {
          refreshLectureList();  // optional: refresh lecture list in parent if provided
        }
      } else {
        message.error(res.data.message || 'Failed to add lecture');
      }
    } catch (err) {
      console.error('Error adding lecture:', err);
      message.error('❌ Server error. Please try again.');
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.warn('Form validation failed:', errorInfo);
    message.warning('Please check the form fields before submitting.');
  };

  return (
    <div style={{ padding: '20px' }}>
      <Card title={<Title level={4}>Add Lecture</Title>} style={{ marginBottom: '20px' }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Lecture Number"
                name="lectureNumber"
                rules={[
                  { required: true, type: 'number', min: 1, max: 6, message: 'Lecture number must be between 1 and 6!' },
                ]}
              >
                <InputNumber min={1} max={6} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Duration"
                name="duration"
                rules={[{ required: true, message: 'Please enter duration!' }]}
              >
                <TimePicker format="HH:mm" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="fromTime"
                label="From Time"
                rules={[{ required: true, message: 'Please select start time!' }]}
              >
                <TimePicker format="HH:mm" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="toTime"
                label="To Time"
                rules={[{ required: true, message: 'Please select end time!' }]}
              >
                <TimePicker format="HH:mm" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit">Add Lecture</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Lecture;
