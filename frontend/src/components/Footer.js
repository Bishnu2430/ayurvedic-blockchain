import React from "react";
import { Link } from "react-router-dom";
import { Leaf, Mail, Phone, MapPin, Github, Twitter } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-sage-800 text-sage-100">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <Link
              to="/"
              className="flex items-center space-x-2 text-xl font-bold text-sage-100 hover:text-mint-400 transition-colors mb-4"
            >
              <div className="p-2 bg-mint-600 rounded-lg">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span>HerbTrace</span>
            </Link>
            <p className="text-sage-300 mb-6 max-w-md">
              Ensuring the authenticity and quality of medicinal herbs through
              blockchain-powered traceability. From farm to pharmacy, trust
              every step of the journey.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com/herbtrace"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sage-400 hover:text-mint-400 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/herbtrace"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sage-400 hover:text-mint-400 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-sage-100 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-sage-300 hover:text-mint-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/trace"
                  className="text-sage-300 hover:text-mint-400 transition-colors"
                >
                  Trace Herbs
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-sage-300 hover:text-mint-400 transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-sage-300 hover:text-mint-400 transition-colors"
                >
                  Join Network
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-sage-100 mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-mint-400" />
                <span className="text-sage-300">info@herbtrace.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-mint-400" />
                <span className="text-sage-300">+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-mint-400" />
                <span className="text-sage-300">Kerala, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Features Section */}
        <div className="border-t border-sage-700 mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div>
              <h4 className="text-mint-400 font-semibold mb-2">
                Blockchain Security
              </h4>
              <p className="text-sage-400 text-sm">
                Immutable records ensuring data integrity and transparency
              </p>
            </div>
            <div>
              <h4 className="text-mint-400 font-semibold mb-2">
                Quality Assurance
              </h4>
              <p className="text-sage-400 text-sm">
                Laboratory testing and certification at every stage
              </p>
            </div>
            <div>
              <h4 className="text-mint-400 font-semibold mb-2">
                Full Traceability
              </h4>
              <p className="text-sage-400 text-sm">
                Complete journey tracking from collection to consumer
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-sage-900 border-t border-sage-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <div className="text-sage-400 text-sm">
              © {currentYear} HerbTrace. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a
                href="/privacy"
                className="text-sage-400 hover:text-mint-400 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="text-sage-400 hover:text-mint-400 transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="/support"
                className="text-sage-400 hover:text-mint-400 transition-colors"
              >
                Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
