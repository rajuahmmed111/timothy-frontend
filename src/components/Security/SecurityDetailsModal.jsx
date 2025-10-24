import React from "react";
import { Modal, Button, Tag } from "antd";

export default function SecurityDetailsModal({ open, onClose, guard }) {
  return (
    <Modal
      title="Security Details"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
    >
      {guard && (
        <div className="space-y-3">
          <img
            src={guard?.securityImages?.[0]}
            alt={guard?.securityGuardName}
            className="w-full h-48 object-cover rounded-md"
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Name</p>
              <p className="font-medium">{guard?.securityGuardName}</p>
            </div>
            <div>
              <p className="text-gray-600">Category</p>
              <p className="font-medium">{guard?.category}</p>
            </div>
            <div>
              <p className="text-gray-600">Location</p>
              <p className="font-medium">{`${guard?.securityCity}, ${guard?.securityCountry}`}</p>
            </div>
            <div>
              <p className="text-gray-600">Experience</p>
              <p className="font-medium">{guard?.experience} years</p>
            </div>
            <div>
              <p className="text-gray-600">Price/Day</p>
              <p className="font-medium">${guard?.securityPriceDay}</p>
            </div>
            <div>
              <p className="text-gray-600">Status</p>
              <Tag color={guard?.isBooked === "AVAILABLE" ? "green" : "red"}>
                {guard?.isBooked}
              </Tag>
            </div>
            {guard?.languages?.length ? (
              <div className="col-span-2">
                <p className="text-gray-600">Languages</p>
                <p className="font-medium">{guard?.languages?.join(", ")}</p>
              </div>
            ) : null}
            {guard?.securityServicesOffered?.length ? (
              <div className="col-span-2">
                <p className="text-gray-600">Services</p>
                <p className="font-medium">
                  {guard?.securityServicesOffered?.join(", ")}
                </p>
              </div>
            ) : null}
            {guard?.securityGuardDescription ? (
              <div className="col-span-2">
                <p className="text-gray-600">Description</p>
                <p className="font-medium">{guard?.securityGuardDescription}</p>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </Modal>
  );
}
