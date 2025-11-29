import React from "react";
import { Link } from "react-router-dom";

function Section({ number, title, content, list }) {
  return (
    <div className="mb-6">
      <div className="flex items-baseline">
        <span className="text-sm font-semibold text-blue-600 mr-3">
          {number}.
        </span>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="mt-2 text-gray-700">
        {content && typeof content === "string" ? <p>{content}</p> : content}
        {Array.isArray(list) && (
          <ul className="list-disc ml-6 mt-2 space-y-1">
            {list.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm">
        <h1 className="text-3xl font-bold mb-2">FASIFY – PRIVACY POLICY</h1>

        <p className="mb-6">
          This Privacy Policy explains how Fasify (“we,” “our,” or “us”)
          collects, uses, stores, and protects your personal information when
          you use our mobile application, website, and related services. By
          using our services, you consent to the practices described in this
          policy.
        </p>

        <Section
          number="1"
          title="Information We Collect"
          list={[
            "Personal Information (Name, Email, Phone Number)",
            "Payment Information (Processed securely through third-party gateways)",
            "Location Information (For booking and personalized experience)",
            "Usage & Device Information (IP, browser type, app activity)",
            "Booking Information (Accommodation, dates, preferences)",
          ]}
        />

        <Section
          number="2"
          title="How We Use Your Information"
          list={[
            "To provide, operate, and improve our services",
            "To enable secure bookings and transactions",
            "To provide customer support",
            "To enhance user safety and fraud prevention",
            "To send service updates, notifications, or promotional content",
          ]}
        />

        <Section
          number="3"
          title="How We Share Your Information"
          list={[
            "With trusted service providers supporting our operations",
            "With accommodation partners and hosts to complete your booking",
            "With legal and regulatory authorities when required",
            "During business transfers such as mergers or acquisitions",
          ]}
        />

        <Section
          number="4"
          title="Data Security"
          content="We implement industry-standard security measures including encryption, secure servers, and PCI-compliant payment processing to protect your information from unauthorized access or disclosure."
        />

        <Section
          number="5"
          title="Your Rights"
          content="Depending on your region, you may have the right to access, correct, delete, restrict processing, or withdraw consent regarding your personal data. To exercise these rights, contact us using the details below."
        />

        <Section
          number="6"
          title="Data Retention"
          content="We retain your information only for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements."
        />

        <Section
          number="7"
          title="Third-Party Services"
          content="Fasify integrates with third-party platforms such as payment gateways, analytics providers, and hosting partners. Each third-party service has its own privacy practices which we encourage you to review."
        />

        <Section
          number="8"
          title="Cookies & Tracking Technologies"
          content="We use cookies, analytics tools, and device identifiers to improve user experience, analyze usage patterns, and provide personalized content and advertisements."
        />

        <Section
          number="9"
          title="Children's Privacy"
          content="Fasify is not intended for children under the age of 16, and we do not knowingly collect information from minors."
        />

        <Section
          number="10"
          title="International Data Transfers"
          content="Your information may be processed and stored in countries outside your own. We ensure appropriate safeguards such as GDPR-compliant transfer mechanisms."
        />

        <Section
          number="11"
          title="Changes to This Policy"
          content="We may update this Privacy Policy periodically. Changes will be reflected with a new 'Last Updated' date."
        />

        <Section
          number="12"
          title="Contact Us"
          content={
            <>
              Email: <a href="mailto:info@fasifys.com">info@fasifys.com</a>{" "}
              <br />
              Phone: +44 7521 010080 <br />
              UK Office: 103 Marsh Hill, Erdington, Birmingham, B23 7DU <br />
              Nigeria Office: 6 Esomo Close, Off Toyin Street, Ikeja, Lagos
            </>
          }
        />
      </div>
    </div>
  );
}
