// Animation variants and decoration generator for Auth UI
import React from 'react';
import { motion } from "framer-motion";

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
      duration: 0.6,
    },
  },
};

export const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
};

export function generateDecorations() {
  const elements = [];
  for (let i = 0; i < 8; i++) {
    elements.push(
      <motion.div
        key={i}
        className="absolute hidden md:block"
        initial={{
          x: typeof window !== "undefined" ? Math.random() * window.innerWidth : 0,
          y: typeof window !== "undefined" ? Math.random() * window.innerHeight : 0,
          scale: Math.random() * 0.5 + 0.5,
          opacity: 0.4,
        }}
        animate={{
          y: [null, Math.random() * 30 - 15],
          rotate: [0, Math.random() > 0.5 ? 360 : -360],
        }}
        transition={{
          duration: Math.random() * 10 + 15,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      >        <div
          className={`w-8 h-8 rounded-full bg-gradient-to-r ${
            i % 2 === 0 ? "from-teal-300 to-blue-200" : "from-blue-300 to-cyan-200"
          } blur-xl`}
          style={{
            width: `${Math.floor(Math.random() * 8) + 4}rem`,
            height: `${Math.floor(Math.random() * 8) + 4}rem`
          }}
        ></div>
      </motion.div>
    );
  }
  return elements;
}
