import React, { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import PasswordInput from "../../components/auth/PasswordInput";
import PasswordRequirements from "../../components/auth/PasswordRequirements";
import ErrorMessage from "../../components/auth/ErrorMessage";
import { getPasswordStrength, getPasswordCriteria } from "../../utils/validation/passwordUtils";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Password criteria and strength
  const criteria = getPasswordCriteria(password);
  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!criteria.hasMinLength || !criteria.hasLetter || !criteria.hasNumber) {
      setError("Password does not meet requirements");
      return;
    }
    setIsLoading(true);
    try {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const accessToken = params.get("access_token");
      if (!accessToken) {
        setError("Invalid or expired reset link");
        setIsLoading(false);
        return;
      }
      const { error } = await supabase.auth.updateUser({
        password: password,
      });
      if (error) throw error;
      alert("Password updated successfully!");
      navigate("/auth");
    } catch (error) {
      console.error("Error updating password:", error);
      setError(error.message || "Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="p-4">
        <Link to="/auth" className="text-black">
          <FiArrowLeft className="w-6 h-6" />
        </Link>
      </header>
      {/* Main Content */}
      <div className="flex-1 px-6 py-4">
        <h1 className="text-4xl font-bold mb-6">Update your password</h1>
        <form onSubmit={handleSubmit}>
          <PasswordInput
            id="password"
            label="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            autoComplete="new-password"
          />
          <PasswordRequirements criteria={criteria} strength={passwordStrength} />
          <PasswordInput
            id="confirmPassword"
            label="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            showPassword={showConfirmPassword}
            setShowPassword={setShowConfirmPassword}
            autoComplete="new-password"
          />
          <ErrorMessage error={error} />
          <button
            type="submit"
            disabled={isLoading || !password || !confirmPassword}
            className={`w-full p-4 rounded-lg text-center font-medium ${
              isLoading || !password || !confirmPassword
                ? "bg-gray-300 text-gray-500"
                : "bg-gray-800 text-white"
            }`}
          >
            {isLoading ? "Updating..." : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
