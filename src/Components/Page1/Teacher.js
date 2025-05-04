import React, { useState } from 'react';
import { Button, Form, Input, Tag, Select, Row, Col, Upload, message, Typography } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const customizeRequiredMark = (label, { required }) => (
  <>
    {required ? <Tag color="error">Required</Tag> : <Tag color="warning">Optional</Tag>}
    {label}
  </>
);

const Teacher = () => {
  const [form] = Form.useForm();
  const [requiredMark, setRequiredMarkType] = useState('optional');

  const onRequiredTypeChange = ({ requiredMarkValue }) => {
    setRequiredMarkType(requiredMarkValue);
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70 }}>
        <Option value="91">+91</Option>
        <Option value="87">+87</Option>
      </Select>
    </Form.Item>
  );

  const normFile = e => (Array.isArray(e) ? e : e?.fileList);

  const beforeUpload = file => {
    const isJpg = file.type === 'image/jpeg';
    if (!isJpg) {
      message.error('You can only upload JPG files!');
    }
    return isJpg || Upload.LIST_IGNORE;
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Page Title and Breadcrumb */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Title level={4} style={{ margin: 0 }}>Add Teacher</Title>
      </div>

      {/* Form */}
        <Form      
        form={form}
        layout="vertical"
        initialValues={{ requiredMarkValue: requiredMark }}
        onValuesChange={onRequiredTypeChange}
        requiredMark={requiredMark === 'customize' ? customizeRequiredMark : requiredMark}
        >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="First Name" name="firstName" rules={[{ required: true, message: 'Please enter first name!' }]}>
              <Input placeholder="Enter First Name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Last Name" name="lastName" rules={[{ required: true, message: 'Please enter last name!' }]}>
              <Input placeholder="Enter Last Name" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="email"
              label="E-mail"
              rules={[
                { type: 'email', message: 'The input is not valid E-mail!' },
                { required: true, message: 'Please input your E-mail!' },
              ]}
            >
              <Input placeholder="Enter Your Email" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="phone" label="Phone Number" rules={[{ required: true, message: 'Please Enter Your Phone Number!' }]}>
              <Input addonBefore={prefixSelector} style={{ width: '100%' }} placeholder="Enter Your Phone Number" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Please input your password!' }]} hasFeedback>
              <Input.Password placeholder="Enter Your Password" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="confirm"
              label="Confirm Password"
              dependencies={['password']}
              hasFeedback
              rules={[
                { required: true, message: 'Please confirm your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The new password that you entered do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Enter Your Confirm Password" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="city" label="City" rules={[{ required: true, message: 'Please enter your city!' }]}>
              <Input placeholder="Enter Your City" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="experience" label="Experience" rules={[{ required: true, message: 'Please enter your experience!' }]}>
              <Input placeholder="Enter Your Experience" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="subject" label="Subject" rules={[{ required: true, message: 'Please enter your subject!' }]}>
              <Input placeholder="Enter Your Subject" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="gender" label="Gender" rules={[{ required: true, message: 'Please select gender!' }]}>
              <Select placeholder="Select your gender">
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="address" label="Address" rules={[{ required: true, message: 'Please enter address!' }]}>
              <Input.TextArea showCount maxLength={100} placeholder="Enter Your Address" />
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
                name="files"
                action="/upload.do"
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
          <Button type="primary" htmlType="submit">
            Add Teacher
          </Button>
        </Form.Item>
        </Form>
    </div>
  );
};

export default Teacher;
