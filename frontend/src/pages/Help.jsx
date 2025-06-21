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
    // Main container uses background and foreground colors
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-background text-foreground">
      {/* H1 uses foreground */}
      <h1 className="text-3xl font-bold mb-6 text-foreground">Help Center</h1>
      
      <div className="flex space-x-2 mb-6 overflow-x-auto">
        {Object.keys(faqs).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            // Tab buttons use primary/secondary semantic colors
            className={`px-4 py-2 rounded-md capitalize ${
              activeTab === tab
                ? 'bg-primary text-primary-foreground' // Active state
                : 'bg-secondary text-secondary-foreground hover:bg-accent' // Inactive state
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {faqs[activeTab].map((item, index) => (
          // FAQ item borders and text colors adjusted
          <div key={index} className="border-b border-border pb-4">
            <h3 className="font-medium text-lg text-foreground">{item.question}</h3>
            <p className="text-muted-foreground mt-1">{item.answer}</p>
          </div>
        ))}
      </div>

      {/* "Still need help?" section uses muted background and foreground text */}
      <div className="mt-8 p-6 bg-muted text-muted-foreground rounded-lg border border-border">
        <h2 className="text-xl font-semibold mb-3 text-foreground">Still need help?</h2>
        <p className="mb-4">Contact our support team 24/7:</p>
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Email/Call buttons remain explicit blue/white */}
          <a href="mailto:support@aliabbaskhan549@gmail.com" className="bg-blue-600 text-white px-4 py-2 rounded-md text-center hover:bg-blue-700 transition">
            Email Us
          </a>
          <a href="tel:+923114666791" className="border border-blue-600 text-blue-600 px-4 py-2 rounded-md text-center hover:bg-blue-50 transition">
            Call Us
          </a>
        </div>
      </div>
    </div>
  );
}
