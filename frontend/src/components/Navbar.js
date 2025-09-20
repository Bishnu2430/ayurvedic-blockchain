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
  Info,
  DollarSign,
  ChevronDown,
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
    const publicLinks = [
      { path: "/", label: "Home", icon: Home },
      { path: "/trace", label: "Trace Herb", icon: Search },
      { path: "/pricing", label: "Pricing", icon: DollarSign },
      { path: "about", label: "About Us", icon: Info, isScroll: true },
    ];

    if (!user) {
      return publicLinks;
    }

    const userLinks = [
      { path: "/dashboard", label: "Dashboard", icon: BarChart3 },
      { path: "/trace", label: "Trace Herb", icon: Search },
      { path: "/pricing", label: "Pricing", icon: DollarSign },
      { path: "about", label: "About Us", icon: Info, isScroll: true },
    ];

    const roleLinks = {
      FARMER: [{ path: "/collect", label: "Collect Herbs", icon: Leaf }],
      LAB: [{ path: "/quality-test", label: "Quality Test", icon: TestTube }],
      PROCESSOR: [{ path: "/process", label: "Process Herbs", icon: Settings }],
      ADMIN: [{ path: "/admin", label: "Admin Panel", icon: Settings }],
    };

    return [...userLinks, ...(roleLinks[user.userType] || [])];
  };

  // Scroll to footer (About Us section)
  const scrollToAbout = (e) => {
    e.preventDefault();
    const footer = document.getElementById("about");
    if (footer) {
      footer.scrollIntoView({ behavior: "smooth" });
    }
    closeMobile();
  };

  return (
    <nav className="bg-white shadow-lg border-b border-sage-100 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center space-x-2 text-xl font-bold text-sage-800 hover:text-mint-600 transition-colors"
            >
              <div className="p-2 bg-gradient-to-br from-mint-100 to-mint-200 rounded-lg shadow-sm">
                <Leaf className="w-6 h-6 text-mint-600" />
              </div>
              <span className="bg-gradient-to-r from-sage-800 to-mint-600 bg-clip-text text-transparent">
                HerbTrace
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {getNavLinks().map((link) => {
              const Icon = link.icon;

              // Handle About Us - scroll to footer
              if (link.isScroll) {
                return (
                  <button
                    key="about"
                    onClick={scrollToAbout}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-sage-600 hover:text-mint-600 hover:bg-mint-50"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </button>
                );
              }

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? "bg-mint-100 text-mint-700 shadow-sm"
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
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-sage-50 transition-colors group"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-mint-100 to-mint-200 rounded-full flex items-center justify-center shadow-sm">
                    <User className="w-4 h-4 text-mint-600" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-sage-800 group-hover:text-mint-600 transition-colors">
                      {user.name}
                    </div>
                    <div className="text-xs text-sage-500 capitalize">
                      {user.userType.toLowerCase()}
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-sage-400 transition-transform ${
                      profileDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Profile Dropdown */}
                {profileDropdown && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-sage-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-sage-100">
                      <p className="text-sm font-medium text-sage-800">
                        {user.name}
                      </p>
                      <p className="text-xs text-sage-500 capitalize">
                        {user.userType.toLowerCase()}
                      </p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdown(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-sage-700 hover:bg-sage-50 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>Profile Settings</span>
                    </Link>
                    <Link
                      to="/dashboard"
                      onClick={() => setProfileDropdown(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-sage-700 hover:bg-sage-50 transition-colors"
                    >
                      <BarChart3 className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                    <hr className="my-2 border-sage-100" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sage-600 hover:text-mint-600 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-mint-50"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-mint-500 to-mint-600 text-white px-6 py-2 rounded-lg hover:from-mint-600 hover:to-mint-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
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
              className="text-sage-600 hover:text-sage-800 p-2 rounded-lg hover:bg-sage-50 transition-colors"
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
        <div className="md:hidden bg-white border-t border-sage-100 shadow-lg">
          <div className="px-4 py-6 space-y-4">
            {/* Navigation Links */}
            {getNavLinks().map((link) => {
              const Icon = link.icon;

              // Handle About Us - scroll to footer
              if (link.isScroll) {
                return (
                  <button
                    key="about-mobile"
                    onClick={scrollToAbout}
                    className="flex items-center space-x-3 w-full px-3 py-3 rounded-lg transition-colors text-sage-600 hover:text-mint-600 hover:bg-mint-50"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{link.label}</span>
                  </button>
                );
              }

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
                <div className="px-3 py-2 bg-sage-50 rounded-lg">
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
                  <span className="font-medium">Profile Settings</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    closeMobile();
                  }}
                  className="flex items-center space-x-3 w-full px-3 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="border-t border-sage-100 pt-4 space-y-3">
                <Link
                  to="/login"
                  onClick={closeMobile}
                  className="block w-full text-center py-3 text-sage-600 hover:text-mint-600 font-medium transition-colors border border-sage-200 rounded-lg hover:bg-sage-50"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={closeMobile}
                  className="block w-full text-center bg-gradient-to-r from-mint-500 to-mint-600 text-white py-3 rounded-lg hover:from-mint-600 hover:to-mint-700 transition-all duration-200 font-medium shadow-sm"
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
