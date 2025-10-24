import React, { useEffect } from "react";
import { Modal, Form, Input, Button, Row, Col, Divider } from "antd";
import Swal from "sweetalert2";
import { useUpdateSecurityBusinessMutation } from "../../redux/api/security/securityApi";

const { TextArea } = Input;

const SecurityBusinessEdit = ({ securityBusiness, hotel, visible, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [updateSecurityBusiness, { isLoading }] = useUpdateSecurityBusinessMutation();

  useEffect(() => {
    const business = securityBusiness || hotel;
    if (business) {
      form.setFieldsValue({
        securityBusinessName: business.securityBusinessName,
        securityName: business.securityName,
        securityBusinessType: business.securityBusinessType || business.securityProtocolType,
        securityRegNum: business.securityRegNum,
        securityRegDate: business.securityRegDate,
        securityPhone: business.securityPhone,
        securityEmail: business.securityEmail,
        businessLogo: business.businessLogo,
        securityTagline: business.securityTagline,
        securityProtocolDescription: business.securityProtocolDescription,
        securityBookingCondition: business.securityBookingCondition,
        securityCancelationPolicy: business.securityCancelationPolicy,
      });
    }
  }, [securityBusiness, hotel, form]);

  const handleSubmit = async (values) => {
    try {
      const business = securityBusiness || hotel;
      if (!business?.id) throw new Error("Missing business id");

      const payload = {
        securityBusinessName: values.securityBusinessName,
        securityName: values.securityName,
        securityBusinessType: values.securityBusinessType,
        securityRegNum: values.securityRegNum,
        securityRegDate: values.securityRegDate,
        securityPhone: values.securityPhone,
        securityEmail: values.securityEmail,
        businessLogo: values.businessLogo,
        securityTagline: values.securityTagline,
        securityProtocolDescription: values.securityProtocolDescription,
        securityBookingCondition: values.securityBookingCondition,
        securityCancelationPolicy: values.securityCancelationPolicy,
      };

      const response = await updateSecurityBusiness({
        id: business.id,
        data: payload,
      }).unwrap();

      if (response && response.success) {
        await Swal.fire({
          icon: "success",
          title: "Success!",
          text: response.message || "Security business updated successfully",
          confirmButtonColor: "#1890ff",
        });
        // Notify parent with updated data
        onSuccess?.(response.data);
        onClose?.();
      } else {
        throw new Error("Failed to update business: Invalid response from server");
      }
    } catch (error) {
      console.error("Error updating security business:", error);
      await Swal.fire({
        icon: "error",
        title: "Error!",
        text:
          error?.response?.data?.message ||
          error?.data?.message ||
          "Failed to update security business. Please try again.",
        confirmButtonColor: "#ff4d4f",
      });
    }
  };

  return (
    <Modal
      title="Edit Security Business"
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
        initialValues={{}}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="securityBusinessName" label="Business Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="securityName" label="Business Display Name">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="securityBusinessType" label="Business Type" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="securityRegNum" label="Registration Number" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="securityRegDate" label="Registration Date">
              <Input placeholder="YYYY-MM-DD" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="businessLogo" label="Business Logo URL">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="securityTagline" label="Tagline">
          <Input />
        </Form.Item>

        <Form.Item name="securityProtocolDescription" label="Protocol Description" rules={[{ required: true }]}> 
          <TextArea rows={4} />
        </Form.Item>

        <Divider>Contact Information</Divider>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="securityPhone" label="Phone" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="securityEmail" label="Email" rules={[{ required: true, type: "email" }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Divider>Policies</Divider>
        <Form.Item name="securityBookingCondition" label="Booking Conditions">
          <TextArea rows={3} />
        </Form.Item>
        <Form.Item name="securityCancelationPolicy" label="Cancellation Policy">
          <TextArea rows={3} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Update Business
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

export default SecurityBusinessEdit;
