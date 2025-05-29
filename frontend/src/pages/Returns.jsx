// src/pages/support/Returns.jsx
export default function Returns() {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-6">Returns & Refunds</h1>
        
        <div className="prose max-w-none">
          <div className="bg-blue-50 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-2">Our Return Policy</h2>
            <p>We offer a 30-day money-back guarantee on all products. If you're not completely satisfied, we'll refund your purchase.</p>
          </div>
  
          <h2 className="text-2xl font-semibold mt-8 mb-4">How to Return an Item</h2>
          <ol className="space-y-4 list-decimal pl-5">
            <li>
              <span className="font-medium">Contact Us</span>
              <p className="text-gray-600">Email returns@yourstore.com with your order number within 30 days of purchase.</p>
            </li>
            <li>
              <span className="font-medium">Package Your Item</span>
              <p className="text-gray-600">Include all original packaging and accessories.</p>
            </li>
            <li>
              <span className="font-medium">Ship It Back</span>
              <p className="text-gray-600">Use the prepaid return label we'll email you.</p>
            </li>
          </ol>
  
          <h2 className="text-2xl font-semibold mt-8 mb-4">Refund Timeline</h2>
          <ul className="space-y-2 list-disc pl-5">
            <li>Processing time: 3-5 business days after we receive your return</li>
            <li>Credit card refunds: 5-10 business days to appear on your statement</li>
          </ul>
  
          <div className="mt-8 p-6 bg-yellow-50 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Important Notes</h3>
            <ul className="space-y-2 list-disc pl-5">
              <li>Return shipping is free for defective items</li>
              <li>Opened software/music/videos are non-refundable</li>
              <li>Final sale items are marked as non-returnable</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }