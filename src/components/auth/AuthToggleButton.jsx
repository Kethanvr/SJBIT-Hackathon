import React from 'react';
import { motion } from "framer-motion";

export default function AuthToggleButton({ isLogin, setIsLogin, variants }) {
  return (
    <motion.div 
      className="relative inline-block"
      variants={variants}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-300/20 to-cyan-300/20 rounded-full blur-md -z-10"></div>
      <motion.button 
        type="button"
        onClick={() => setIsLogin(!isLogin)}
        className="relative px-6 py-2.5 rounded-full bg-white/50 backdrop-blur-sm border border-blue-100 text-blue-700 font-medium transition-all hover:shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        {isLogin
          ? "New to MediScan? Create Account"
          : "Already have an account? Sign In"}
      </motion.button>
    </motion.div>
  );
}
