import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function FAQ() {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (index) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const navigate = useNavigate();

  const faqData = [
    {
      question: "How do I make a hotel reservation?",
      answer:
        "Simply use our search feature to find hotels by location, select your check-in and check-out dates, choose the number of guests and rooms, then browse available options and book your preferred hotel.",
    },
    {
      question: "Can I cancel or modify my booking?",
      answer:
        "Yes, you can cancel or modify most bookings through your account dashboard. Cancellation policies vary by hotel and booking type. Please check the specific terms during booking.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. All payments are processed securely through our encrypted payment system.",
    },
    {
      question: "Do you offer car rental services?",
      answer:
        "Yes! FASIFY provides comprehensive car rental services with various vehicle categories. You can book cars for different durations and locations through our car rental section.",
    },
    {
      question: "What security services do you provide?",
      answer:
        "We offer professional security services including personal protection, event security, and property security. Our certified security professionals can be booked for various occasions and durations.",
    },
    {
      question: "How can I book attraction tickets?",
      answer:
        "Browse our attractions section to find popular tourist destinations and events. You can book tickets directly through our platform with instant confirmation and mobile tickets.",
    },
    {
      question: "Is customer support available 24/7?",
      answer:
        "Yes, our customer support team is available 24/7 to assist you with bookings, modifications, or any questions you may have. Contact us through chat, email, or phone.",
    },
    {
      question: "Do you offer group booking discounts?",
      answer:
        "Yes, we offer special rates for group bookings. Contact our sales team for customized packages for groups of 10 or more people for hotels, attractions, or combined services.",
    },
    {
      question: "Can I earn rewards or loyalty points?",
      answer:
        "Absolutely! Join our FASIFY Rewards program to earn points on every booking. Points can be redeemed for discounts on future reservations across all our services.",
    },
    {
      question: "What if I need to change my travel dates?",
      answer:
        "You can modify your travel dates through your account dashboard, subject to availability and the specific terms of your booking. Some changes may incur fees depending on the service provider's policy.",
    },
  ];

  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our services and booking
            process
          </p>
        </div>

        <div className="container mx-auto">
          <div className="w-full space-y-4 grid grid-cols-1 md:grid-cols-2 gap-10">
            {faqData.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {item.question}
                  </h3>
                  <div className="flex-shrink-0">
                    {openItems[index] ? (
                      <ChevronUp className="w-5 h-5 text-[#0064D2]" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#0064D2]" />
                    )}
                  </div>
                </button>

                {openItems[index] && (
                  <div className="px-6 pb-4">
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-gray-700 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
