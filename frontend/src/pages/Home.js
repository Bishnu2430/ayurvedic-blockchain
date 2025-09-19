import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Shield,
  Search,
  Users,
  Leaf,
  TestTube,
  Settings,
  ChevronRight,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: Shield,
      title: "Blockchain Security",
      description:
        "Immutable records powered by Hyperledger Fabric ensure data integrity and prevent tampering.",
    },
    {
      icon: Search,
      title: "Complete Traceability",
      description:
        "Track every step from herb collection to final product with QR code scanning.",
    },
    {
      icon: TestTube,
      title: "Quality Assurance",
      description:
        "Laboratory testing and certification processes ensure herb authenticity and quality.",
    },
    {
      icon: Users,
      title: "Multi-Stakeholder",
      description:
        "Connect farmers, labs, processors, and consumers in a transparent network.",
    },
  ];

  const stakeholders = [
    {
      icon: Leaf,
      title: "Farmers",
      description: "Record herb collection with location and quality data",
      action: "Start Collecting",
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      icon: TestTube,
      title: "Laboratories",
      description: "Add quality test results and certifications",
      action: "Begin Testing",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: Settings,
      title: "Processors",
      description: "Document processing steps and conditions",
      action: "Process Herbs",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      icon: Users,
      title: "Consumers",
      description: "Verify authenticity and trace herb journey",
      action: "Trace Products",
      color: "text-mint-600",
      bg: "bg-mint-50",
    },
  ];

  const benefits = [
    "Eliminate counterfeit medicinal herbs",
    "Ensure quality and safety standards",
    "Build consumer trust and confidence",
    "Streamline compliance and auditing",
    "Support sustainable farming practices",
    "Enable rapid recall when needed",
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-mint-50 via-cream-50 to-sage-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-sage-800 mb-6">
              Trust Every Herb with
              <span className="text-mint-600 block">
                Blockchain Traceability
              </span>
            </h1>
            <p className="text-xl text-sage-600 mb-8 max-w-3xl mx-auto">
              Ensuring the authenticity and quality of medicinal herbs through
              transparent, immutable records. From farm to pharmacy, track every
              step of the journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-8 py-4 bg-mint-500 text-white font-semibold rounded-lg hover:bg-mint-600 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-mint"
                >
                  Go to Dashboard
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center px-8 py-4 bg-mint-500 text-white font-semibold rounded-lg hover:bg-mint-600 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-mint"
                  >
                    Join the Network
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </Link>
                  <Link
                    to="/trace"
                    className="inline-flex items-center px-8 py-4 border-2 border-sage-300 text-sage-700 font-semibold rounded-lg hover:bg-sage-50 transition-colors"
                  >
                    Trace a Herb
                    <Search className="ml-2 w-5 h-5" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-sage-800 mb-4">
              Why Choose HerbTrace?
            </h2>
            <p className="text-lg text-sage-600 max-w-2xl mx-auto">
              Our blockchain-powered platform ensures transparency, security,
              and trust in the medicinal herb supply chain.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="p-6 bg-cream-50 rounded-xl hover:shadow-soft transition-shadow card-hover"
                >
                  <div className="w-12 h-12 bg-mint-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-mint-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-sage-800 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sage-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stakeholders Section */}
      <section className="py-16 bg-sage-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-sage-800 mb-4">
              For Every Stakeholder
            </h2>
            <p className="text-lg text-sage-600 max-w-2xl mx-auto">
              Whether you're a farmer, lab technician, processor, or consumer,
              HerbTrace has tools designed for your role.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stakeholders.map((stakeholder, index) => {
              const Icon = stakeholder.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-soft hover:shadow-lg transition-all card-hover"
                >
                  <div
                    className={`w-12 h-12 ${stakeholder.bg} rounded-lg flex items-center justify-center mb-4`}
                  >
                    <Icon className={`w-6 h-6 ${stakeholder.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-sage-800 mb-3">
                    {stakeholder.title}
                  </h3>
                  <p className="text-sage-600 mb-4">
                    {stakeholder.description}
                  </p>
                  <Link
                    to={user ? "/dashboard" : "/register"}
                    className={`inline-flex items-center font-semibold ${stakeholder.color} hover:underline`}
                  >
                    {stakeholder.action}
                    <ArrowRight className="ml-1 w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-sage-800 mb-6">
                Transforming the Herbal Medicine Industry
              </h2>
              <p className="text-lg text-sage-600 mb-8">
                HerbTrace addresses critical challenges in the medicinal herb
                supply chain, providing unprecedented transparency and trust.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-mint-500 flex-shrink-0" />
                    <span className="text-sage-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-mint-100 to-sage-100 p-8 rounded-2xl">
              <div className="text-center">
                <div className="text-4xl font-bold text-mint-600 mb-2">
                  10,000+
                </div>
                <div className="text-sage-700 mb-6">
                  Herbs Traced Successfully
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-semibold text-sage-800">
                      500+
                    </div>
                    <div className="text-sm text-sage-600">Active Farmers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-sage-800">
                      50+
                    </div>
                    <div className="text-sm text-sage-600">Certified Labs</div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-sage-800">
                      25+
                    </div>
                    <div className="text-sm text-sage-600">
                      Processing Units
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-sage-800">
                      99.9%
                    </div>
                    <div className="text-sm text-sage-600">Uptime</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-sage-800">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Join the Future of Herbal Medicine?
          </h2>
          <p className="text-xl text-sage-200 mb-8">
            Start building trust in your herbal products today with
            blockchain-powered traceability.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!user && (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center px-8 py-4 bg-mint-500 text-white font-semibold rounded-lg hover:bg-mint-600 transition-colors"
                >
                  Get Started Free
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  to="/trace"
                  className="inline-flex items-center px-8 py-4 border-2 border-sage-300 text-sage-200 font-semibold rounded-lg hover:bg-sage-700 transition-colors"
                >
                  Try Demo
                  <Search className="ml-2 w-5 h-5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
