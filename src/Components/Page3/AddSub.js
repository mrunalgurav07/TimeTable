// import React from 'react';
// import { Button, Form, Row, Col, Input, Typography} from 'antd';

// const { Title } = Typography;
// const AddSub = () => {
//   const [form] = Form.useForm();

//   return (
//    <div style={{ padding: '20px' }}>
//       <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
//         <Title level={4} style={{ margin: 0 }}>Add Subject</Title>
//       </div> 

//     <Form
//       form={form}
//       layout="vertical"
//     >
//       <Row gutter={16}>
//         <Col span={12}>
//           <Form.Item label="Subject Name" name="subjectName" rules={[{ required: true, message: 'Please enter subject!' }]}>
//             <Input placeholder="Enter Subject Name" />
//           </Form.Item>
//         </Col>
//         <Col span={12}>
//           <Form.Item label="Subject Code" name="subjectCode" rules={[{ required: true, message: 'Please enter subject code!' }]}>
//             <Input placeholder="Enter Subject Code" />
//           </Form.Item>
//         </Col>
//       </Row>

//       <Form.Item>
//         <Button type="primary" htmlType="submit">Add Subject</Button>
//       </Form.Item>
//     </Form>
//   </div>    
//   );
// };

// export default AddSub;
