import React, { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Row,
  Col,
  Checkbox,
  Divider,
} from "antd";
import Swal from "sweetalert2";
import { useUpdateHotelBusinessMutation } from "../../redux/api/hotel/hotelApi";

const { TextArea } = Input;

const HotelBusinessEdit = ({ hotel, visible, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [updateHotelBusiness, { isLoading }] = useUpdateHotelBusinessMutation();

  useEffect(() => {
    if (hotel) {
      form.setFieldsValue({
        ...hotel,
      });
    }
  }, [hotel, form]);

  const handleSubmit = async (values) => {
    try {
      // Convert checkbox values to boolean if they're not already
      const formattedValues = {
        ...values,
        hotelAC: Boolean(values.hotelAC),
        hotelParking: Boolean(values.hotelParking),
        hoitelWifi: Boolean(values.hoitelWifi),
        hotelPool: Boolean(values.hotelPool),
        hotelSpa: Boolean(values.hotelSpa),
        hotelGym: Boolean(values.hotelGym),
      };

      const response = await updateHotelBusiness({
        id: hotel.id,
        data: formattedValues,
      }).unwrap();

      if (response && response.success) {
        await Swal.fire({
          icon: "success",
          title: "Success!",
          text: response.message || "Hotel updated successfully",
          confirmButtonColor: "#1890ff",
        });
        // Call onSuccess with the updated hotel data
        onSuccess?.(response.data);
        onClose?.();
      } else {
        throw new Error("Failed to update hotel: Invalid response from server");
      }
    } catch (error) {
      console.error("Error updating hotel:", error);
      await Swal.fire({
        icon: "error",
        title: "Error!",
        text:
          error?.response?.data?.message ||
          error?.data?.message ||
          "Failed to update hotel. Please try again.",
        confirmButtonColor: "#ff4d4f",
      });
    }
  };

  return (
    <Modal
      title="Edit Hotel Information"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          ...hotel,
          hotelAC: Boolean(hotel?.hotelAC),
          hotelParking: Boolean(hotel?.hotelParking),
          hoitelWifi: Boolean(hotel?.hoitelWifi),
          hotelPool: Boolean(hotel?.hotelPool),
          hotelSpa: Boolean(hotel?.hotelSpa),
          hotelGym: Boolean(hotel?.hotelGym),
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="hotelBusinessName"
              label="Business Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="hotelName"
              label="Hotel Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="hotelBusinessType"
              label="Business Type"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="hotelRegNum"
              label="Registration Number"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="businessDescription"
          label="Description"
          rules={[{ required: true }]}
        >
          <TextArea rows={4} />
        </Form.Item>

        <Divider>Contact Information</Divider>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="hotelPhone"
              label="Phone"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="hotelEmail"
              label="Email"
              rules={[{ required: true, type: "email" }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Divider>Facilities</Divider>
        <Row gutter={16}>
          {[
            { name: "hotelAC", label: "Air Conditioning" },
            { name: "hotelParking", label: "Parking" },
            { name: "hoitelWifi", label: "WiFi" },
            { name: "hotelPool", label: "Swimming Pool" },
            { name: "hotelSpa", label: "Spa" },
            { name: "hotelGym", label: "Gym" },
          ].map((facility) => (
            <Col span={8} key={facility.name}>
              <Form.Item name={facility.name} valuePropName="checked">
                <Checkbox>{facility.label}</Checkbox>
              </Form.Item>
            </Col>
          ))}
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Update Hotel
          </Button>
          <Button
            onClick={onClose}
            style={{ marginLeft: 8 }}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default HotelBusinessEdit;
