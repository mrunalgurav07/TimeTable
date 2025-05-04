import React from 'react';
import { Button, Form, Row, Col, TimePicker, InputNumber ,Typography} from 'antd';

const { Title } = Typography;
const Lecture = () => {
  const [form] = Form.useForm();

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Title level={4} style={{ margin: 0 }}>Add Lecture</Title>
      </div>    
    <Form
      form={form}
      layout="vertical"
    //   requiredMark={customizeRequiredMark}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Lecture Number"
            name="lectureNumber"
            rules={[
              {
                required: true,
                type: 'number',
                min: 1,
                max: 6,
                message: 'Lecture number must be between 1 and 6!',
              },
            ]}
          >
            <InputNumber min={1} max={6} defaultValue={1} style={{ width: '100%' }} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Duration (in minutes)"
            name="duration"
            rules={[{ required: true, message: 'Please enter duration!' }]}
          >
            <TimePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="fromTime"
            label="From Time"
            rules={[{ type: 'object', required: true, message: 'Please select start time!' }]}
          >
            <TimePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="toTime"
            label="To Time"
            rules={[{ type: 'object', required: true, message: 'Please select end time!' }]}
          >
            <TimePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item>
        <Button type="primary" htmlType="submit">Add Lecture</Button>
      </Form.Item>
    </Form>
  </div>
  );
};

export default Lecture;
