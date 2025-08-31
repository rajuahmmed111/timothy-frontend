import React from 'react';
import { Form, Input, Button, Select, InputNumber, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

export default function AddBusiness() {
    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log('Success:', values);
        message.success('Business added successfully!');
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    return (
        <div className="max-w-4xl mx-auto">
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-6">Add New Business</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Form.Item
                            label="Business Name"
                            name="name"
                            rules={[{ required: true, message: 'Please input the business name!' }]}
                        >
                            <Input placeholder="Enter business name" />
                        </Form.Item>

                        <Form.Item
                            label="Business Type"
                            name="type"
                            rules={[{ required: true, message: 'Please select business type!' }]}
                        >
                            <Select placeholder="Select business type">
                                <Option value="hotel">Hotel</Option>
                                <Option value="resort">Resort</Option>
                                <Option value="villa">Villa</Option>
                                <Option value="apartment">Apartment</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Description"
                            name="description"
                            rules={[{ required: true, message: 'Please input description!' }]}
                            className="md:col-span-2"
                        >
                            <TextArea rows={4} placeholder="Enter business description" />
                        </Form.Item>

                        <Form.Item
                            label="Address"
                            name="address"
                            rules={[{ required: true, message: 'Please input address!' }]}
                            className="md:col-span-2"
                        >
                            <Input placeholder="Enter full address" />
                        </Form.Item>

                        <Form.Item
                            label="City"
                            name="city"
                            rules={[{ required: true, message: 'Please input city!' }]}
                        >
                            <Input placeholder="Enter city" />
                        </Form.Item>

                        <Form.Item
                            label="Country"
                            name="country"
                            rules={[{ required: true, message: 'Please select country!' }]}
                        >
                            <Select placeholder="Select country">
                                <Option value="us">United States</Option>
                                <Option value="uk">United Kingdom</Option>
                                <Option value="ca">Canada</Option>
                                <Option value="au">Australia</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Price per night"
                            name="price"
                            rules={[{ required: true, message: 'Please input price!' }]}
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Amenities"
                            name="amenities"
                            className="md:col-span-2"
                        >
                            <Select mode="multiple" placeholder="Select amenities">
                                <Option value="wifi">Free WiFi</Option>
                                <Option value="pool">Swimming Pool</Option>
                                <Option value="spa">Spa</Option>
                                <Option value="restaurant">Restaurant</Option>
                                <Option value="gym">Fitness Center</Option>
                                <Option value="parking">Free Parking</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Upload Images"
                            name="images"
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                            className="md:col-span-2"
                        >
                            <Upload
                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                listType="picture"
                                multiple
                            >
                                <Button icon={<UploadOutlined />}>Upload</Button>
                            </Upload>
                        </Form.Item>
                    </div>

                    <div className="flex justify-end mt-6 space-x-3">
                        <Button>Cancel</Button>
                        <Button type="primary" htmlType="submit">
                            Save Business
                        </Button>
                    </div>
                </div>
            </Form>
        </div>
    );
};