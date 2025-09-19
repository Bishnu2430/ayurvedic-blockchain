import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { Eye, EyeOff, Leaf, Mail, Lock, ArrowRight } from "lucide-react";
import LoadingSpinner, { ButtonSpinner } from "../components/LoadingSpinner";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { login, user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
      toast.success("Welcome back!");
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const demoAccounts = [
    {
      email: "farmer@example.com",
      type: "Farmer",
      desc: "Collection & farming features",
    },
    {
      email: "lab@example.com",
      type: "Laboratory",
      desc: "Quality testing features",
    },
    {
      email: "processor@example.com",
      type: "Processor",
      desc: "Processing workflow",
    },
    {
      email: "consumer@example.com",
      type: "Consumer",
      desc: "Herb tracing & verification",
    },
  ];

  const fillDemoAccount = (email) => {
    setFormData({
      email: email,
      password: "password123",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-sage-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-2xl font-bold text-sage-800 hover:text-mint-600 transition-colors"
          >
            <div className="p-2 bg-mint-100 rounded-lg">
              <Leaf className="w-8 h-8 text-mint-600" />
            </div>
            <span>HerbTrace</span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-sage-800">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-sage-600">
            Or{" "}
            <Link
              to="/register"
              className="font-medium text-mint-600 hover:text-mint-500 transition-colors"
            >
              create a new account
            </Link>
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-soft border border-sage-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-sage-700 mb-1"
              >
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="w-5 h-5 text-sage-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors ${
                    errors.email
                      ? "border-red-300 bg-red-50"
                      : "border-sage-300"
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-sage-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="w-5 h-5 text-sage-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors ${
                    errors.password
                      ? "border-red-300 bg-red-50"
                      : "border-sage-300"
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-sage-400 hover:text-sage-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-mint-600 focus:ring-mint-500 border-sage-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-sage-700"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-mint-600 hover:text-mint-500 transition-colors"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-mint-600 hover:bg-mint-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mint-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading && <ButtonSpinner />}
              Sign in
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>

        {/* Demo Accounts */}
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
          <h3 className="text-sm font-medium text-blue-800 mb-3">
            Demo Accounts (Password: password123)
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {demoAccounts.map((account, index) => (
              <button
                key={index}
                onClick={() => fillDemoAccount(account.email)}
                className="text-left p-3 bg-white rounded-md border border-blue-200 hover:bg-blue-25 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-blue-800">
                      {account.type}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">{account.desc}</p>
                  </div>
                  <span className="text-xs text-blue-500 font-mono">
                    {account.email}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-sage-500">
            By signing in, you agree to our{" "}
            <a href="#" className="text-mint-600 hover:text-mint-500">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-mint-600 hover:text-mint-500">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
