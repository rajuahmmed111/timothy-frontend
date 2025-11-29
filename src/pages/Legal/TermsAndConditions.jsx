import React from "react";

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

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm">
        <h1 className="text-3xl font-bold mb-2">
          FASIFY – TERMS &amp; CONDITIONS
        </h1>

        <p className="mb-6 text-gray-700">
          Welcome to Fasify. By accessing or using our mobile application,
          website, or related services (“Services”), you agree to be bound by
          these Terms &amp; Conditions. Please read them carefully.
        </p>

        <Section
          number="1"
          title="Acceptance of Terms"
          content="By creating an account or using Fasify, you agree to comply with these Terms, our Privacy Policy, and all applicable laws."
        />

        <Section
          number="2"
          title="Eligibility"
          content="Users must be at least 18 years old or have legal capacity to enter into binding agreements."
        />

        <Section
          number="3"
          title="User Accounts"
          content="You must provide accurate information when creating an account. You are responsible for maintaining the confidentiality of your login details."
        />

        <Section
          number="4"
          title="Booking and Payments"
          list={[
            "All bookings made through Fasify are subject to availability and confirmation.",
            "Payments are processed securely through third-party payment providers.",
            "Fasify does not store complete payment card details.",
          ]}
        />

        <Section
          number="5"
          title="Pricing and Fees"
          content="Prices may vary depending on location, availability, and season. Taxes and service fees may apply."
        />

        <Section
          number="6"
          title="Cancellations &amp; Refunds"
          content="Cancellations are governed by our Cancellation Policy. Refund eligibility depends on the timing and circumstances."
        />

        <Section
          number="7"
          title="User Responsibilities"
          list={[
            "Provide false information",
            "Misuse the platform",
            "Violate applicable laws",
            "Attempt to hack, reverse-engineer, or disrupt the system",
          ]}
        />

        <Section
          number="8"
          title="Prohibited Activities"
          list={[
            "Fraud",
            "Abuse of promotions or discounts",
            "Posting harmful or illegal content",
            "Interfering with other users or hosts",
          ]}
        />

        <Section
          number="9"
          title="Host Responsibilities"
          content="Hosts must ensure that accommodation listings are accurate, safe, and comply with local regulations."
        />

        <Section
          number="10"
          title="Liability"
          content={
            <>
              <p>Fasify is not responsible for:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Damages caused by hosts or guests</li>
                <li>Cancellations due to external factors</li>
                <li>Losses arising from misuse of the platform</li>
              </ul>
              <p className="mt-2">
                To the fullest extent permitted by law, Fasify shall not be
                liable for indirect, incidental, or consequential damages.
              </p>
            </>
          }
        />

        <Section
          number="11"
          title="Intellectual Property"
          content="All content, branding, logos, and designs are the property of Fasify and may not be reproduced without permission."
        />

        <Section
          number="12"
          title="Suspension &amp; Termination"
          content="We may suspend or terminate accounts that violate these Terms or threaten the safety of the community."
        />

        <Section
          number="13"
          title="Data Protection"
          content="Your personal data is handled according to our Privacy Policy."
        />

        <Section
          number="14"
          title="Modifications"
          content="Fasify may update these Terms at any time. Continued use of the Services constitutes acceptance of revised Terms."
        />

        <Section
          number="15"
          title="Governing Law"
          content="These Terms are governed by the laws of the United Kingdom and Nigeria, depending on the user's location."
        />

        <Section
          number="16"
          title="Contact Information"
          content={
            <>
              <p>For questions or support, contact us:</p>
              <p className="mt-2">
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:info@fasifys.com"
                  className="text-blue-600 hover:underline"
                >
                  info@fasifys.com
                </a>
                <br />
                <strong>Phone:</strong> +44 7521 010080
                <br />
                <strong>UK Office:</strong> 103 Marsh Hill, Erdington,
                Birmingham, B23 7DU
                <br />
                <strong>Nigeria Office:</strong> 6 Esomo Close, Off Toyin
                Street, Ikeja, Lagos
              </p>
            </>
          }
        />
      </div>
    </div>
  );
}
