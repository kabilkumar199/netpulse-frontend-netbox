import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../../store/authStore";
import { useNavigate } from "react-router-dom";
import { Button, Input, Card } from "../../common/ui";
import Logo from "../../common/Layout/Logo";
import { api } from "../../../services/api/api";
import { toast } from "react-toastify";
import { Formik, Form, Field } from "formik";
import { validationSchemas } from "../../../utils/validation";
import FormikInput from "../../../utils/FormikInput";
import { API_ENDPOINTS } from "../../../helpers/url_helper";

interface LoginResponse {
  token: string;
  refreshToken: string;
  firstname?: string;
  lastname?: string;
  userId: string;
  username: string;
  email: string;
  name?: string;
  fullName?: string;
  roles?: string[];
}

const Login: React.FC = () => {
  const { isLoading, error, setCredentials, setLoading, setError } = useAuthStore();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const initialValues = {
    username: localStorage.getItem("rememberedUser") || "",
    password: "",
    rememberMe: !!localStorage.getItem("rememberedUser"),
  };

  const handleFormikSubmit = async (
    values: typeof initialValues,
    { setSubmitting, setStatus }: any
  ) => {
    setLoading(true);
    setError(null);
    setStatus(null);

    try {
      const respData = await api.post<LoginResponse>(API_ENDPOINTS.LOGIN, {
        username: values.username,
        password: values.password,
      });

      if (values.rememberMe) {
        localStorage.setItem("rememberedUser", values.username);
      } else {
        localStorage.removeItem("rememberedUser");
      }

      const userObjectToStore = {
        firstname: respData.firstname,
        lastname: respData.lastname,
        id: respData.userId,
        username: respData.username,
        email: respData.email,
        name: respData.name || respData.fullName || respData.username || "",
        role: respData.roles?.[0] || "user",
      };

      setCredentials({
        user: userObjectToStore,
        token: respData.token,
        refreshToken: respData.refreshToken,
      });
      const whoLoggedIn =
        userObjectToStore.name ||
        userObjectToStore.username ||
        userObjectToStore.role;
      toast.success(`Login successful for" ${whoLoggedIn}`);
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      let message = err?.response?.data?.message;
      if (
        err?.response?.status === 401 ||
        (message &&
          (message.includes("LDAP") || message.includes("INVALID_CREDENTIALS")))
      ) {
        message = "Invalid username or password.";
      } else {
        message = message || "Login failed. Please check your credentials.";
      }

      setError(message);
      setStatus(message);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-blue-900 via-indigo-900 to-gray-900 border-r border-gray-800">
          <div>
            <Logo className="" width={200} height={28} />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-white leading-tight">
              Unified Network Intelligence
            </h2>
            <p className="text-gray-300">
              Discover, monitor, and manage your entire network with real-time
              insights, powerful automation, and beautiful visualizations.
            </p>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center gap-3">
                <span className="text-blue-400">✓</span>
                Topology discovery and mapping
              </li>
              <li className="flex items-center gap-3">
                <span className="text-blue-400">✓</span>
                Device inventory and configuration
              </li>
              <li className="flex items-center gap-3">
                <span className="text-blue-400">✓</span>
                Performance and log analytics
              </li>
            </ul>
          </div>
          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()} Exaware Routing Ltd. — NMS 2.1.6
          </div>
        </div>

        {/* Auth Panel */}
        <div className="flex items-center justify-center px-6 py-12 lg:px-12">
          <div className="w-full max-w-md">
            <div className="bg-gray-900/60 backdrop-blur border border-gray-800 rounded-xl shadow-lg p-8">
              <div className="mb-8 text-center">
                <div className="flex justify-center items-center lg:hidden">
                  <Logo className="mx-auto mb-4" width={180} height={24} />
                </div>
                <h1 className="text-2xl font-semibold text-white">
                  Welcome back
                </h1>
                <p className="text-gray-400 mt-1">Sign in to your account</p>
              </div>

              <Formik
                initialValues={initialValues}
                validationSchema={validationSchemas.loginSchema}
                onSubmit={handleFormikSubmit}
              >
                {({ isSubmitting, isValid, status }) => (
                  <Form className="space-y-5">
                    <FormikInput
                      name="username"
                      label="Username"
                      type="text"
                      placeholder="user name"
                    />
                    <FormikInput
                      name="password"
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      suffix={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-gray-400 text-sm hover:text-gray-300"
                        >
                          {showPassword ? (
                            // Eye-Off Icon
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-1.29-1.29m-2.637-2.637L4.5 5.25A9.95 9.95 0 0112 4.5c4.478 0 8.268 2.943 9.543 7a9.97 9.97 0 01-1.563 3.029m-5.858-.908l-4.242-4.242"
                              />
                            </svg>
                          ) : (
                            // Eye Icon
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.057 9.542 6.042C19.732 16.057 15.523 19 12 19c-4.478 0-8.268-2.943-9.542-6.958z"
                              />
                            </svg>
                          )}
                        </button>
                      }
                    />

                    <div className="flex items-center justify-between">
                      <label className="inline-flex items-center text-sm text-gray-300">
                        <Field
                          type="checkbox"
                          name="rememberMe"
                          className="mr-2 rounded border-gray-700 bg-gray-800 text-blue-600 focus:ring-blue-500"
                        />
                        Remember me
                      </label>
                      <button
                        type="button"
                        onClick={() => navigate("/forgot-password")}
                        className="text-sm text-blue-400 hover:text-blue-300"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <button
                      type="submit"
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      // 14. Disable based on Formik state
                      disabled={isSubmitting || !isValid}
                    >
                      {isSubmitting ? "Signing in..." : "Sign in"}
                    </button>
                    {status && (
                      <div className="p-3 text-center text-sm  text-red-200 bg-red-900/50 border border-red-700 rounded-lg">
                        {status}
                      </div>
                    )}
                  </Form>
                )}
              </Formik>

              <p className="text-xs text-gray-500 mt-6 text-center">
                By signing in, you agree to the Terms of Service and Privacy
                Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
