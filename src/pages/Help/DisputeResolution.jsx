import React, { useState } from 'react';

export default function DisputeResolution() {
  const [activeTab, setActiveTab] = useState('user');
  const [formData, setFormData] = useState({
    type: 'user',
    confirmationNo: '',
    fullName: '',
    email: '',
    phone: '',
    topic: '',
    message: '',
    partnerName: '',
    propertyId: ''
  });

  const userTopics = [
    'Reservation',
    'Refunds',
    'Customer Service',
    'Others'
  ];

  const partnerTopics = [
    'Reservation',
    'Financial',
    'Joining and Leaving FASIFY',
    'Staff Behavior',
    'Compliance',
    'Fraud & Security',
    'Property Related'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    alert('Your dispute has been submitted. We will contact you shortly.');
    // Reset form
    setFormData({
      type: activeTab,
      confirmationNo: '',
      fullName: '',
      email: '',
      phone: '',
      topic: '',
      message: '',
      partnerName: '',
      propertyId: ''
    });
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Dispute Resolution Center
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Report issues and resolve disputes
          </p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('user')}
                className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${activeTab === 'user'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Guest
              </button>
              <button
                onClick={() => setActiveTab('partner')}
                className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${activeTab === 'partner'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Partner
              </button>
            </nav>
          </div>

          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {activeTab === 'user' && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="confirmationNo" className="block text-sm font-medium text-gray-700">
                      Confirmation Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="confirmationNo"
                      id="confirmationNo"
                      required
                      value={formData.confirmationNo}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'partner' && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="partnerName" className="block text-sm font-medium text-gray-700">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="partnerName"
                      id="partnerName"
                      required
                      value={formData.partnerName}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="propertyId" className="block text-sm font-medium text-gray-700">
                      Property ID (if applicable)
                    </label>
                    <input
                      type="text"
                      name="propertyId"
                      id="propertyId"
                      value={formData.propertyId}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                    {activeTab === 'user' ? 'Your Full Name' : 'Contact Person'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
                  Topic <span className="text-red-500">*</span>
                </label>
                <select
                  id="topic"
                  name="topic"
                  required
                  value={formData.topic}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">Select a topic</option>
                  {(activeTab === 'user' ? userTopics : partnerTopics).map((topic) => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Detailed Message <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                    placeholder="Please provide detailed information about your dispute or concern..."
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Please include all relevant details to help us resolve your issue quickly.
                </p>
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Submit Dispute
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-blue-800">Need Immediate Assistance?</h3>
          <div className="mt-2 text-blue-700">
            <p className="text-sm">
              For urgent matters, please contact our support team directly:
            </p>
            <ul className="mt-2 space-y-1 text-sm">
              <li>📞 <a href="tel:+15551234567" className="hover:underline">+1 (555) 123-4567</a> (24/7 Support)</li>
              <li>✉️ <a href="mailto:disputes@fasify.com" className="hover:underline">disputes@fasify.com</a></li>
            </ul>
            <p className="mt-3 text-sm">
              Our team typically responds to disputes within 24-48 hours during business days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
