// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function About() {
  return (
    // Main background now uses bg-background, text-foreground for defaults
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-8">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        // Card background now uses bg-card and text-card-foreground
        className="max-w-3xl bg-card text-card-foreground p-10 rounded-3xl shadow-2xl space-y-6"
      >
        {/* H1 remains explicit purple */}
        <h1 className="text-4xl font-bold text-purple-600 text-center">About Our Shop</h1>
        {/* Paragraph text uses muted-foreground for body text */}
        <p className="text-lg leading-relaxed text-muted-foreground text-black dark:text-white">
          Welcome to our e-commerce platform! We are passionate about delivering high-quality products and outstanding customer service. Whether you're shopping for fashion, tech, or home essentials, we strive to offer the best.
        </p>
        <p className="text-lg leading-relaxed text-muted-foreground text-black dark:text-white">
          Our mission is to make online shopping effortless, fun, and rewarding. Thank you for trusting us with your needs — we promise to exceed your expectations!
        </p>
      </motion.div>
    </div>
  );
}
