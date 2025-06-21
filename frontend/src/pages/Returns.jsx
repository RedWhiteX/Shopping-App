export default function Returns() {
  return (
    // Main container uses background and foreground colors
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-background text-foreground">
      {/* H1 uses foreground */}
      <h1 className="text-3xl font-bold mb-6 text-foreground">Returns & Refunds</h1>
      
      <div className="prose max-w-none">
        {/* Return Policy section uses muted background and foreground text, with border */}
        <div className="bg-muted text-muted-foreground p-6 rounded-lg mb-8 border border-border">
          <h2 className="text-xl font-semibold mb-2 text-foreground">Our Return Policy</h2>
          <p>We offer a 30-day money-back guarantee on all products. If you're not completely satisfied, we'll refund your purchase.</p>
        </div>

        {/* Headings use foreground */}
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">How to Return an Item</h2>
        <ol className="space-y-4 list-decimal pl-5">
          <li>
            <span className="font-medium text-foreground">Contact Us</span>
            <p className="text-muted-foreground">Email returns@yourstore.com with your order number within 30 days of purchase.</p>
          </li>
          <li>
            <span className="font-medium text-foreground">Package Your Item</span>
            <p className="text-muted-foreground">Include all original packaging and accessories.</p>
          </li>
          <li>
            <span className="font-medium text-foreground">Ship It Back</span>
            <p className="text-muted-foreground">Use the prepaid return label we'll email you.</p>
          </li>
        </ol>

        {/* Heading uses foreground */}
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">Refund Timeline</h2>
        <ul className="space-y-2 list-disc pl-5">
          <li className="text-muted-foreground">Processing time: 3-5 business days after we receive your return</li>
          <li className="text-muted-foreground">Credit card refunds: 5-10 business days to appear on your statement</li>
        </ul>

        {/* Important Notes section uses muted background and foreground text, with border */}
        <div className="mt-8 p-6 bg-muted text-muted-foreground rounded-lg border border-border">
          <h3 className="font-semibold text-lg mb-2 text-foreground">Important Notes</h3>
          <ul className="space-y-2 list-disc pl-5">
            <li className="text-muted-foreground">Return shipping is free for defective items</li>
            <li className="text-muted-foreground">Opened software/music/videos are non-refundable</li>
            <li className="text-muted-foreground">Final sale items are marked as non-returnable</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
