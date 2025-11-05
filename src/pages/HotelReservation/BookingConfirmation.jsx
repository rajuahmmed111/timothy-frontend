import React, { useState } from "react";
import {
  CheckCircle,
  MapPin,
  Calendar,
  Users,
  Mail,
  Wifi,
  Car,
  Coffee,
  Utensils,
  Waves,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Modal, Dropdown, Menu } from "antd";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  FilePdfOutlined,
  FileImageOutlined,
  FileTextOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

const defaultBookingData = {
  bookingId: "BK" + Math.floor(10000000 + Math.random() * 90000000),
  hotelName: "Luxury Hotel",
  location: "Beachfront Resort, Maldives",
  checkIn: new Date().toISOString().split("T")[0],
  checkOut: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0],
  guests: 2,
  roomType: "Deluxe Suite",
  total: 2500,
  bookingDate: new Date().toISOString().split("T")[0],
  paymentMethod: "Credit Card",
  rating: 4.8,
  rooms: 1,
  adults: 2,
  children: 0,
  isRefundable: true,
  vat: 10,
  nights: 7,
};

export default function BookingConfirmation() {
  const location = useLocation();
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [bookingData] = useState(() => {
    if (location.state?.bookingData) return location.state.bookingData;
    try {
      const saved = sessionStorage.getItem("lastBooking");
      if (saved) return JSON.parse(saved);
    } catch {}
    return { ...defaultBookingData };
  });

  const formatDisplayDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const calculateTotal = () => {
    const base = bookingData?.total || 0;
    const vatAmt = bookingData?.vat ? (base * bookingData.vat) / 100 : 0;
    return { subTotal: base - vatAmt, vat: vatAmt, total: base };
  };

  const { total } = calculateTotal();

  const hotelDetails = {
    address: bookingData?.location,
    checkInTime: "2:00 PM",
    checkOutTime: "12:00 PM",
    description:
      "Nestled along the pristine shores of Thailand's Riviera, Azure Oasis offers an unparalleled luxury experience.",
    amenities: [
      { icon: Wifi, name: "Free WiFi" },
      { icon: Car, name: "Free Parking" },
      { icon: Coffee, name: "Coffee Bar" },
      { icon: Waves, name: "Swimming Pool" },
      { icon: Utensils, name: "Restaurant" },
    ],
  };

  const handleSendToEmail = () => {
    setIsEmailSending(true);
    const subject = `Booking Confirmation - ${bookingData.hotelName}`;
    const body = `
Booking ID: ${bookingData.bookingId}
Hotel: ${bookingData.hotelName}
Location: ${bookingData.location}
Room Type: ${bookingData.roomType}
Check-in: ${formatDisplayDate(bookingData.checkIn)} (After ${
      hotelDetails.checkInTime
    })
Check-out: ${formatDisplayDate(bookingData.checkOut)} (Before ${
      hotelDetails.checkOutTime
    })
Guests: ${bookingData.adults} Adult(s), ${bookingData.children} Child(ren)
Total: $${bookingData.total}
`;

    const mailtoUrl = `mailto:${
      bookingData?.user?.email || ""
    }?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;

    setTimeout(() => {
      setShowSuccessModal(true);
      setIsEmailSending(false);
    }, 1000);
  };

  const handleDownload = async ({ key }) => {
    const element = document.getElementById("booking-summary");
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });
    const imgData = canvas.toDataURL("image/png");

    if (key === "image") {
      const link = document.createElement("a");
      link.href = imgData;
      link.download = `booking_${bookingData.bookingId}.png`;
      link.click();
    } else if (key === "pdf") {
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`booking_${bookingData.bookingId}.pdf`);
    } else if (key === "json") {
      const blob = new Blob([JSON.stringify(bookingData, null, 2)], {
        type: "application/json",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `booking_${bookingData.bookingId}.json`;
      link.click();
    }
  };

  const downloadMenu = (
    <Menu onClick={handleDownload}>
      <Menu.Item key="pdf" icon={<FilePdfOutlined />}>
        Download as PDF
      </Menu.Item>
      <Menu.Item key="image" icon={<FileImageOutlined />}>
        Download as Image
      </Menu.Item>
      <Menu.Item key="json" icon={<FileTextOutlined />}>
        Download as JSON
      </Menu.Item>
    </Menu>
  );

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-sky-600 to-blue-700 px-6 py-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Booking Confirmed!
            </h1>
            <p className="text-blue-100">Booking ID: {bookingData.bookingId}</p>
          </div>

          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-2">{bookingData.hotelName}</h2>
            <p className="text-gray-600 mb-4">{hotelDetails.description}</p>
            <div className="flex items-center text-gray-600 mb-6">
              <MapPin className="w-5 h-5 mr-2 text-sky-600" />
              {hotelDetails.address}
            </div>
            <div className="flex items-center justify-between">
              <div
                id="booking-summary"
                className="bg-white p-6 rounded-lg  mt-8"
              >
                <h2 className="text-2xl font-semibold mb-4 text-center">
                  Booking Summary
                </h2>
                <p>
                  <b>Hotel:</b> {bookingData.hotelName}
                </p>
                <p>
                  <b>Location:</b> {bookingData.location}
                </p>
                <p>
                  <b>Check-in:</b>{" "}
                  {new Date(bookingData.checkIn).toLocaleDateString()}
                </p>
                <p>
                  <b>Check-out:</b>{" "}
                  {new Date(bookingData.checkOut).toLocaleDateString()}
                </p>
                <p>
                  <b>Guests:</b> {bookingData.adults} Adults,{" "}
                  {bookingData.children} Children
                </p>
                <p>
                  <b>Room Type:</b> {bookingData.roomType}
                </p>
                <p>
                  <b>Total:</b> ${bookingData.total}
                </p>
              </div>
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  User Information
                </h3>
                <div className="space-y-2 text-gray-600">
                  <p>
                    <b>Name:</b> {bookingData.user.name}
                  </p>
                  <p>
                    <b>Email:</b> {bookingData.user.email}
                  </p>
                  <p>
                    <b>Phone:</b> {bookingData.user.phone}
                  </p>
                  <p>
                    <b>Country:</b> {bookingData.user.country}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                to="/"
                className="block w-full text-center bg-sky-600 text-white py-3 rounded-lg hover:bg-sky-700"
              >
                Back to Home
              </Link>
              <button
                onClick={handleSendToEmail}
                disabled={isEmailSending}
                className="w-full border border-gray-300 bg-white py-3 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <Mail className="inline w-5 h-5 mr-2" />
                {isEmailSending ? "Sending..." : "Send to Email"}
              </button>
              {/* <button
                onClick={() => window.print()}
                className="w-full border border-gray-300 bg-white py-3 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Print Confirmation
              </button> */}

              <Dropdown
                overlay={downloadMenu}
                placement="topCenter"
                trigger={["click"]}
              >
                <button className="w-full border border-gray-300 bg-white py-3 rounded-lg text-gray-700 hover:bg-gray-50">
                  <DownloadOutlined className="mr-2" />
                  Download Booking Data
                </button>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>

      <Modal
        title={null}
        open={showSuccessModal}
        onCancel={() => setShowSuccessModal(false)}
        footer={null}
        centered
      >
        <div className="text-center py-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            Email Sent Successfully!
          </h3>
          <p className="text-gray-600 mb-4">
            Your booking confirmation has been sent.
          </p>
          <button
            onClick={() => setShowSuccessModal(false)}
            className="bg-sky-600 text-white px-6 py-2 rounded-lg"
          >
            OK
          </button>
        </div>
      </Modal>
    </div>
  );
}
