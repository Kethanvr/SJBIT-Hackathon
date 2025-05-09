import { useState } from "react";
import { Link } from "react-router-dom";
import PasswordInput from "../../components/auth/PasswordInput";
import AuthErrorAlert from "../../components/auth/AuthErrorAlert";
import { updateUserPassword } from "../../utils/authUtils";
import { useProTheme } from "../../utils/useProTheme";

export default function Security() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { isPro, theme } = useProTheme();

  // Handles password update logic
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Optionally: validate current password here if needed
    const { error } = await updateUserPassword(newPassword);
    if (error) {
      setError(error.message || "Failed to update password.");
      setLoading(false);
      return;
    }
    setSuccess(true);
    setPassword("");
    setNewPassword("");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b">
        <div className="flex items-center max-w-lg mx-auto">
          <Link
            to="/account"
            className="p-2 -ml-2 rounded-full hover:bg-gray-100"
          >
            {/* Consider extracting this back button as a reusable component if used elsewhere */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <h1 className={`ml-4 text-xl font-semibold ${isPro ? 'text-yellow-800' : 'text-gray-900'}`}>Login & Security</h1>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-lg mx-auto px-4 py-6">
        <form
          onSubmit={handlePasswordChange}
          className="bg-white rounded-xl overflow-hidden"
        >
          <div className="divide-y divide-gray-100">
            {error && <AuthErrorAlert error={error} />}
            {success && (
              <div className={`p-4 ${isPro ? 'bg-yellow-50 text-yellow-600' : 'bg-green-50 text-green-600'} text-sm`}>
                Password updated successfully!
              </div>
            )}
            <div className="p-4">
              <PasswordInput
                id="current_password"
                label="Current Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                required
              />
            </div>
            <div className="p-4">
              <PasswordInput
                id="new_password"
                label="New Password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                showPassword={showNewPassword}
                setShowPassword={setShowNewPassword}
                required
              />
            </div>
            <div className="p-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full ${isPro ? 'bg-gradient-to-tr from-yellow-300 to-yellow-500 text-yellow-900 border-2 border-yellow-400 hover:from-yellow-400 hover:to-yellow-500' : 'bg-blue-600 text-white hover:bg-blue-700'} py-2 rounded-lg font-medium transition disabled:opacity-50`}
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
