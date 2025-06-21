export default function Shipping() {
  return (
    // Main container uses background and foreground colors
    <div className="max-w-4xl mx-auto p-4 bg-background text-foreground">
      {/* H1 uses foreground */}
      <h1 className="text-3xl font-bold mb-6 text-foreground text-center items-center mt-40">Shipping Policy</h1>
      <div className="prose">
        {/* H2 uses foreground */}
        <h2 className="text-2xl font-semibold text-foreground  text-center items-center">Delivery Times</h2>
        {/* Paragraph uses muted-foreground */}
        <p className="text-muted-foreground  text-center items-center">We ship within 2-3 business days...</p>
        {/* Add more sections */}
      </div>
    </div>
  );
}
