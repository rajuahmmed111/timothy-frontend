import React, { useEffect } from "react";
import { Modal, Form, Input, Select, message } from "antd";
import { useUpdateAttractionBusinessMutation } from "../../redux/api/attraction/attractionApi";

export default function AttractionBusinessEdit({ visible, onClose, attraction, onSuccess }) {
  const [form] = Form.useForm();
  const [updateAttractionBusiness, { isLoading }] = useUpdateAttractionBusinessMutation();

  useEffect(() => {
    if (attraction) {
      form.setFieldsValue({
        attractionBusinessName: attraction.attractionBusinessName,
        attractionName: attraction.attractionName,
        attractionBusinessType: attraction.attractionBusinessType,
        attractionRegNum: attraction.attractionRegNum,
        attractionRegDate: attraction.attractionRegDate,
        attractionPhone: attraction.attractionPhone,
        attractionEmail: attraction.attractionEmail,
        attractionBusinessTagline: attraction.attractionBusinessTagline,
        attractionBusinessDescription: attraction.attractionBusinessDescription,
        attractionBookingCondition: attraction.attractionBookingCondition,
        attractionCancelationPolicy: attraction.attractionCancelationPolicy,
      });
    } else {
      form.resetFields();
    }
  }, [attraction, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = { ...values };
      const res = await updateAttractionBusiness({ id: attraction.id, data: payload }).unwrap();
      if (res?.success) {
        message.success(res?.message || "Attraction business updated successfully");
        onSuccess?.(res?.data || payload);
        onClose?.();
      }
    } catch (err) {
      if (err?.data?.message) {
        message.error(err.data.message);
      } else {
        message.error("Failed to update attraction business");
      }
    }
  };

  return (
    <Modal
      title="Manage Attraction Business"
      open={visible}
      onOk={handleOk}
      onCancel={onClose}
      okText={isLoading ? "Saving..." : "Save"}
      okButtonProps={{ loading: isLoading, type: "primary" }}
      destroyOnClose
      width={700}
    >
      <Form form={form} layout="vertical">
        <Form.Item 
          name="attractionBusinessName" 
          label="Business Name" 
          rules={[{ required: true, message: "Please enter business name" }]}
        >
          <Input placeholder="Business Name" />
        </Form.Item>

        <Form.Item 
          name="attractionName" 
          label="Attraction Name" 
          rules={[{ required: true, message: "Please enter attraction name" }]}
        >
          <Input placeholder="Attraction Name" />
        </Form.Item>

        <Form.Item 
          name="attractionBusinessType" 
          label="Business Type" 
          rules={[{ required: true, message: "Please select business type" }]}
        >
          <Select
            placeholder="Select Business Type"
            options={[
              { label: "Resort & Waterpark", value: "Resort & Waterpark" },
              { label: "Museum", value: "museum" },
              { label: "Art Gallery", value: "art-gallery" },
              { label: "Theme Park", value: "theme-park" },
              { label: "Zoo", value: "zoo" },
              { label: "Aquarium", value: "aquarium" },
              { label: "Botanical Garden", value: "botanical-garden" },
              { label: "Historical Site", value: "historical-site" },
              { label: "Cultural Center", value: "cultural-center" },
              { label: "Observation Deck", value: "observation-deck" },
              { label: "Adventure Park", value: "adventure-park" },
              { label: "Beach", value: "beach" },
              { label: "Park", value: "park" },
            ]}
          />
        </Form.Item>

        <Form.Item 
          name="attractionRegNum" 
          label="Registration Number"
          rules={[{ required: true, message: "Please enter registration number" }]}
        >
          <Input placeholder="Registration Number" />
        </Form.Item>

        <Form.Item 
          name="attractionRegDate" 
          label="Registration Date"
          rules={[{ required: true, message: "Please enter registration date" }]}
        >
          <Input type="date" placeholder="Registration Date" />
        </Form.Item>

        <Form.Item 
          name="attractionPhone" 
          label="Phone" 
          rules={[{ required: true, message: "Please enter phone number" }]}
        >
          <Input placeholder="Phone Number" />
        </Form.Item>

        <Form.Item 
          name="attractionEmail" 
          label="Email" 
          rules={[
            { required: true, message: "Please enter email" },
            { type: "email", message: "Please enter a valid email" }
          ]}
        >
          <Input placeholder="Email Address" />
        </Form.Item>

        <Form.Item name="attractionBusinessTagline" label="Business Tagline">
          <Input placeholder="Business Tagline" />
        </Form.Item>

        <Form.Item name="attractionBusinessDescription" label="Description">
          <Input.TextArea rows={3} placeholder="Business description" />
        </Form.Item>

        <Form.Item name="attractionBookingCondition" label="Booking Conditions">
          <Input.TextArea rows={3} placeholder="Booking conditions" />
        </Form.Item>

        <Form.Item name="attractionCancelationPolicy" label="Cancellation Policy">
          <Input.TextArea rows={3} placeholder="Cancellation policy" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
