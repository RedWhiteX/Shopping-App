// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-200 flex items-center justify-center p-8">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl bg-white p-10 rounded-3xl shadow-2xl space-y-6"
      >
        <h1 className="text-4xl font-bold text-purple-600 text-center">About Our Shop</h1>
        <p className="text-gray-700 text-lg leading-relaxed">
          Welcome to our e-commerce platform! We are passionate about delivering high-quality products and outstanding customer service. Whether you're shopping for fashion, tech, or home essentials, we strive to offer the best.
        </p>
        <p className="text-gray-700 text-lg leading-relaxed">
          Our mission is to make online shopping effortless, fun, and rewarding. Thank you for trusting us with your needs — we promise to exceed your expectations!
        </p>
      </motion.div>
    </div>
  );
}
