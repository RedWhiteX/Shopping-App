// src/pages/support/HelpCenter.jsx
import { useState } from 'react';

export default function HelpCenter() {
  const [activeTab, setActiveTab] = useState('shipping');

  const faqs = {
    shipping: [
      { question: "How long does shipping take?", answer: "Typically 3-5 business days within the US." },
      { question: "Do you ship internationally?", answer: "Yes, we ship to over 50 countries worldwide." }
    ],
    returns: [
      { question: "What's your return policy?", answer: "30-day money-back guarantee on all products." },
      { question: "How do I initiate a return?", answer: "Contact our support team with your order number." }
    ],
    account: [
      { question: "How do I reset my password?", answer: "Use the 'Forgot Password' link on the login page." }
    ]
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Help Center</h1>
      
      <div className="flex space-x-2 mb-6 overflow-x-auto">
        {Object.keys(faqs).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md capitalize ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {faqs[activeTab].map((item, index) => (
          <div key={index} className="border-b pb-4">
            <h3 className="font-medium text-lg">{item.question}</h3>
            <p className="text-gray-600 mt-1">{item.answer}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Still need help?</h2>
        <p className="mb-4">Contact our support team 24/7:</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a href="mailto:support@aliabbaskhan549@gmail.com" className="bg-blue-600 text-white px-4 py-2 rounded-md text-center">
            Email Us
          </a>
          <a href="tel:+923114666791" className="border border-blue-600 text-blue-600 px-4 py-2 rounded-md text-center">
            Call Us
          </a>
        </div>
      </div>
    </div>
  );
}