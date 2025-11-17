import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; 
import Logo from "../../common/Layout/Logo";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !repeatPassword) {
      setError("Please fill in both fields.");
      return;
    }
    if (newPassword !== repeatPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Password reset failed.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="bg-gray-900/60 backdrop-blur border border-gray-800 rounded-xl shadow-lg p-10 max-w-md text-center">
          <Logo className="mx-auto mb-6" width={180} height={24} />
          <h2 className="text-2xl font-semibold text-white mb-4">
            Password Reset Successful 🎉
          </h2>
          <p className="text-gray-400 mb-8">
            Your password has been successfully updated.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Brand / Promo Panel */}
        <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-blue-900 via-indigo-900 to-gray-900 border-r border-gray-800">
          <div>
            <Logo width={200} height={28} />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-white leading-tight">
              Unified Network Intelligence
            </h2>
            <p className="text-gray-300">
              Manage and secure your network with confidence.
            </p>
          </div>
          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()} Exaware Routing Ltd. — NMS 2.1.6
          </div>
        </div>

        {/* Reset Password Panel */}
        <div className="flex items-center justify-center px-6 py-12 lg:px-12">
          <div className="w-full max-w-md">
            <div className="bg-gray-900/60 backdrop-blur border border-gray-800 rounded-xl shadow-lg p-8">
              <div className="mb-8 text-center">
                <div className="flex justify-center items-center lg:hidden">
                  <Logo className="mx-auto mb-4" width={180} height={24} />
                </div>
                <h1 className="text-2xl font-semibold text-white">
                  Reset Password
                </h1>
                <p className="text-gray-400 mt-1">
                  Enter your new password below
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Username/Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Username or Email
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {showNewPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Repeat Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Repeat New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showRepeatPassword ? "text" : "password"}
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {showRepeatPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-red-500 text-sm text-center">{error}</p>
                )}

                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  disabled={!newPassword || !repeatPassword || loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </form>

              <p className="text-sm text-center text-gray-400 mt-6">
                Remembered your password?{" "}
                <button
                  type="button"
                  className="text-blue-400 hover:text-blue-300"
                  onClick={() => navigate("/login")}
                >
                  Back to Login
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
