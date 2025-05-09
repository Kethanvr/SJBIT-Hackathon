import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function ForgotPasswordLink({ variants }) {
  return (
    <motion.div 
      className="mt-5 text-center"
      variants={variants}
    >
      <Link 
        to="/auth/reset-password" 
        className="text-blue-600 hover:text-blue-700 text-sm font-medium relative inline-block group"
      >
        <span>Forgot your password?</span>
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
      </Link>
    </motion.div>
  );
}
