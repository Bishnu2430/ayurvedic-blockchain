import React from "react";
import { Link } from "react-router-dom";
import { Leaf, Mail, Phone, MapPin, Github, Linkedin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="about"
      className="bg-gradient-to-t from-sage-900 to-sage-800 text-sage-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <Link
              to="/"
              className="flex items-center space-x-3 text-2xl font-bold text-white hover:text-mint-400 transition-colors mb-4"
            >
              <div className="p-2 bg-mint-600 rounded-lg transition-transform transform hover:scale-110">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span>HerbTrace</span>
            </Link>
            <p className="text-sage-400 mb-6 max-w-md">
              Ensuring the authenticity and quality of medicinal herbs through
              blockchain traceability. From farm to pharmacy, trust every step
              of the journey.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/Bishnu2430"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sage-400 hover:text-mint-400 transition-transform transform hover:scale-110"
                aria-label="GitHub"
              >
                <Github className="w-6 h-6" />
              </a>
              <a
                href="https://www.linkedin.com/in/bishnu-prasad-kar-600092317/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sage-400 hover:text-mint-400 transition-transform transform hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-mint-400 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-sage-400 hover:text-mint-400 transition-colors relative group"
                >
                  Home
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-mint-400 transition-all group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link
                  to="/trace"
                  className="text-sage-400 hover:text-mint-400 transition-colors relative group"
                >
                  Trace Herbs
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-mint-400 transition-all group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-sage-400 hover:text-mint-400 transition-colors relative group"
                >
                  Dashboard
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-mint-400 transition-all group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-sage-400 hover:text-mint-400 transition-colors relative group"
                >
                  Join Network
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-mint-400 transition-all group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-sage-400 hover:text-mint-400 transition-colors relative group"
                >
                  About Us
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-mint-400 transition-all group-hover:w-full"></span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-mint-400 mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-mint-400 transition-transform transform hover:scale-110" />
                <a
                  href="mailto:info@herbtrace.com"
                  className="text-sage-400 hover:text-mint-400 transition-colors"
                >
                  info@herbtrace.com
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-mint-400 transition-transform transform hover:scale-110" />
                <a
                  href="tel:+917750023564"
                  className="text-sage-400 hover:text-mint-400 transition-colors"
                >
                  +91 7750023564
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-mint-400 transition-transform transform hover:scale-110" />
                <span className="text-sage-400">Bhubaneswar, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Features Section */}
        <div className="border-t border-sage-700 mt-10 pt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          {[
            {
              title: "Blockchain Security",
              desc: "Immutable records ensuring data integrity and transparency",
            },
            {
              title: "Quality Assurance",
              desc: "Laboratory testing and certification at every stage",
            },
            {
              title: "Full Traceability",
              desc: "Complete journey tracking from collection to consumer",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="transition-transform transform hover:-translate-y-1 hover:shadow-md rounded-lg p-4 hover:bg-sage-800/30"
            >
              <h4 className="text-mint-400 font-semibold mb-2">
                {feature.title}
              </h4>
              <p className="text-sage-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-sage-800 border-t border-sage-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          <div className="text-sage-400 text-sm">
            © {currentYear} HerbTrace. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm">
            <Link
              to="/privacy"
              className="text-sage-400 hover:text-mint-400 transition-colors relative group"
            >
              Privacy Policy
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-mint-400 transition-all group-hover:w-full"></span>
            </Link>
            <Link
              to="/terms"
              className="text-sage-400 hover:text-mint-400 transition-colors relative group"
            >
              Terms of Service
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-mint-400 transition-all group-hover:w-full"></span>
            </Link>
            <Link
              to="/support"
              className="text-sage-400 hover:text-mint-400 transition-colors relative group"
            >
              Support
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-mint-400 transition-all group-hover:w-full"></span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
