import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import {
  Menu,
  X,
  User,
  LogOut,
  Home,
  Search,
  Leaf,
  TestTube,
  Settings,
  BarChart3,
} from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
    setProfileDropdown(false);
  };

  const toggleMobile = () => {
    setIsOpen(!isOpen);
  };

  const closeMobile = () => {
    setIsOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const getNavLinks = () => {
    if (!user) {
      return [
        { path: "/", label: "Home", icon: Home },
        { path: "/trace", label: "Trace Herb", icon: Search },
      ];
    }

    const commonLinks = [
      { path: "/dashboard", label: "Dashboard", icon: BarChart3 },
      { path: "/trace", label: "Trace Herb", icon: Search },
    ];

    const roleLinks = {
      FARMER: [{ path: "/collect", label: "Collect Herbs", icon: Leaf }],
      LAB: [{ path: "/quality-test", label: "Quality Test", icon: TestTube }],
      PROCESSOR: [{ path: "/process", label: "Process Herbs", icon: Settings }],
      ADMIN: [{ path: "/admin", label: "Admin Panel", icon: Settings }],
    };

    return [...commonLinks, ...(roleLinks[user.userType] || [])];
  };

  return (
    <nav className="bg-white shadow-soft border-b border-sage-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center space-x-2 text-xl font-bold text-sage-800 hover:text-mint-600 transition-colors"
            >
              <div className="p-2 bg-mint-100 rounded-lg">
                <Leaf className="w-6 h-6 text-mint-600" />
              </div>
              <span>HerbTrace</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {getNavLinks().map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? "bg-mint-100 text-mint-700"
                      : "text-sage-600 hover:text-mint-600 hover:bg-mint-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdown(!profileDropdown)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-sage-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-mint-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-mint-600" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-sage-800">
                      {user.name}
                    </div>
                    <div className="text-xs text-sage-500 capitalize">
                      {user.userType.toLowerCase()}
                    </div>
                  </div>
                </button>

                {/* Profile Dropdown */}
                {profileDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-soft border border-sage-100 py-2">
                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdown(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-sage-700 hover:bg-sage-50"
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                    <hr className="my-2 border-sage-100" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sage-600 hover:text-mint-600 font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-mint-500 text-white px-4 py-2 rounded-lg hover:bg-mint-600 transition-colors font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobile}
              className="text-sage-600 hover:text-sage-800 p-2"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-sage-100">
          <div className="px-4 py-6 space-y-4">
            {/* Navigation Links */}
            {getNavLinks().map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={closeMobile}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                    isActive(link.path)
                      ? "bg-mint-100 text-mint-700"
                      : "text-sage-600 hover:text-mint-600 hover:bg-mint-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              );
            })}

            {/* User Section */}
            {user ? (
              <div className="border-t border-sage-100 pt-4 space-y-2">
                <div className="px-3 py-2">
                  <div className="text-sm font-medium text-sage-800">
                    {user.name}
                  </div>
                  <div className="text-xs text-sage-500 capitalize">
                    {user.userType.toLowerCase()}
                  </div>
                </div>
                <Link
                  to="/profile"
                  onClick={closeMobile}
                  className="flex items-center space-x-3 px-3 py-3 rounded-lg text-sage-600 hover:text-mint-600 hover:bg-mint-50 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full px-3 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="border-t border-sage-100 pt-4 space-y-2">
                <Link
                  to="/login"
                  onClick={closeMobile}
                  className="block w-full text-center py-3 text-sage-600 hover:text-mint-600 font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={closeMobile}
                  className="block w-full text-center bg-mint-500 text-white py-3 rounded-lg hover:bg-mint-600 transition-colors font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Overlay for profile dropdown */}
      {profileDropdown && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setProfileDropdown(false)}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;
