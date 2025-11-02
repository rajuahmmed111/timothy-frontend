import React, { useEffect } from "react";
import { Modal, Form, Input, Select, message } from "antd";
import { useUpdateCarBusinessMutation } from "../../redux/api/car/carApi";

export default function CarBusinessEdit({ visible, onClose, car, onSuccess }) {
  const [form] = Form.useForm();
  const [updateCarBusiness, { isLoading }] = useUpdateCarBusinessMutation();

  useEffect(() => {
    if (car) {
      form.setFieldsValue({
        carBusinessName: car.carBusinessName,
        carName: car.carName,
        carBusinessType: car.carBusinessType,
        carPhone: car.carPhone,
        carEmail: car.carEmail,
        carRentalDescription: car.carRentalDescription,
        carBookingCondition: car.carBookingCondition,
        carCancelationPolicy: car.carCancelationPolicy,
        officeAddress: car.officeAddress,
        carCity: car.carCity,
        carCountry: car.carCountry,
      });
    } else {
      form.resetFields();
    }
  }, [car, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = { ...values };
      const res = await updateCarBusiness({ id: car.id, data: payload }).unwrap();
      if (res?.success) {
        message.success(res?.message || "Business updated successfully");
        onSuccess?.(res?.data || payload);
        onClose?.();
      }
    } catch (err) {
      if (err?.data?.message) message.error(err.data.message);
    }
  };

  return (
    <Modal
      title="Manage Business"
      open={visible}
      onOk={handleOk}
      onCancel={onClose}
      okText={isLoading ? "Saving..." : "Save"}
      okButtonProps={{ loading: isLoading, type: "primary" }}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item name="carBusinessName" label="Business Name" rules={[{ required: true }]}>
          <Input placeholder="Business Name" />
        </Form.Item>
        <Form.Item name="carName" label="Car Name/Model" rules={[{ required: true }]}>
          <Input placeholder="Car Name" />
        </Form.Item>
        <Form.Item name="carBusinessType" label="Business Type" rules={[{ required: true }]}>
          <Select
            options={[
              { label: "Private", value: "Private" },
              { label: "Corporate", value: "Corporate" },
              { label: "Rental Service", value: "Rental Service" },
              { label: "self-drive", value: "self-drive" },
              { label: "chauffeur", value: "chauffeur" },
              { label: "long-term", value: "long-term" },
            ]}
          />
        </Form.Item>

        <Form.Item name="carPhone" label="Phone" rules={[{ required: true }]}>
          <Input placeholder="Phone" />
        </Form.Item>
        <Form.Item name="carEmail" label="Email" rules={[{ required: true, type: "email" }]}>
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item name="carRentalDescription" label="Description">
          <Input.TextArea rows={3} placeholder="Business description" />
        </Form.Item>
        <Form.Item name="carBookingCondition" label="Booking Conditions">
          <Input.TextArea rows={3} placeholder="Booking conditions" />
        </Form.Item>
        <Form.Item name="carCancelationPolicy" label="Cancellation Policy">
          <Input.TextArea rows={3} placeholder="Cancellation policy" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
