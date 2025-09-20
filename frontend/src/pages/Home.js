import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Shield,
  Search,
  TestTube,
  Users,
  ChevronRight,
  CheckCircle,
  TrendingUp,
  Globe,
  Award,
  Zap,
  Package,
  Activity,
} from "lucide-react";

const Home = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    dailyVisits: 0,
    totalUsers: 0,
    herbsProcessed: 0,
    activeRegions: 0,
  });

  // Simulate real-time stats
  useEffect(() => {
    const animateStats = () => {
      const targetStats = {
        dailyVisits: 2847,
        totalUsers: 15623,
        herbsProcessed: 45782,
        activeRegions: 28,
      };

      const duration = 2000; // 2 seconds
      const steps = 60; // 60 fps
      const increment = duration / steps;

      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);

        setStats({
          dailyVisits: Math.floor(targetStats.dailyVisits * easeOutQuart),
          totalUsers: Math.floor(targetStats.totalUsers * easeOutQuart),
          herbsProcessed: Math.floor(targetStats.herbsProcessed * easeOutQuart),
          activeRegions: Math.floor(targetStats.activeRegions * easeOutQuart),
        });

        if (currentStep >= steps) {
          clearInterval(timer);
          setStats(targetStats);
        }
      }, increment);

      return () => clearInterval(timer);
    };

    const timeout = setTimeout(animateStats, 500);
    return () => clearTimeout(timeout);
  }, []);

  const features = [
    {
      icon: Shield,
      title: "Blockchain Security",
      description:
        "Immutable records powered by Hyperledger Fabric ensure data integrity and prevent tampering.",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: Search,
      title: "Complete Traceability",
      description:
        "Track every step from herb collection to final product with QR code scanning.",
      color: "from-blue-500 to-cyan-600",
    },
    {
      icon: TestTube,
      title: "Quality Assurance",
      description:
        "Laboratory testing and certification processes ensure herb authenticity and quality.",
      color: "from-purple-500 to-violet-600",
    },
    {
      icon: Users,
      title: "Multi-Stakeholder",
      description:
        "Connect farmers, labs, processors, and consumers in a transparent network.",
      color: "from-orange-500 to-red-600",
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

  const testimonials = [
    {
      name: "Dr. Priya Sharma",
      role: "Ayurvedic Practitioner",
      content:
        "HerbTrace has revolutionized how I verify the authenticity of medicinal herbs for my patients.",
      rating: 5,
    },
    {
      name: "Rajesh Kumar",
      role: "Herb Farmer",
      content:
        "The platform helps me showcase the quality of my herbs and build trust with buyers.",
      rating: 5,
    },
    {
      name: "Mumbai Herbs Lab",
      role: "Quality Testing Lab",
      content:
        "Integration with HerbTrace streamlined our testing workflow and certification process.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-sage-900 via-sage-800 to-mint-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-sage-900/80 to-transparent"></div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-mint-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-sage-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Trust Every Herb with
              <span className="block text-transparent bg-gradient-to-r from-mint-400 to-green-400 bg-clip-text">
                Blockchain Traceability
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-sage-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Ensuring the authenticity and quality of medicinal herbs through
              transparent, immutable records. From farm to pharmacy, track every
              step of the journey.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              {user ? (
                <Link
                  to="/dashboard"
                  className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-mint-500 to-mint-600 text-white font-semibold rounded-xl hover:from-mint-600 hover:to-mint-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl shadow-lg"
                >
                  Go to Dashboard
                  <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-mint-500 to-mint-600 text-white font-semibold rounded-xl hover:from-mint-600 hover:to-mint-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl shadow-lg"
                  >
                    Join the Network
                    <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/trace"
                    className="group inline-flex items-center px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 hover:border-white/50 backdrop-blur-sm transition-all duration-300"
                  >
                    Trace a Herb
                    <Search className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                  </Link>
                </>
              )}
            </div>

            {/* Real-time Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-center justify-center mb-2">
                  <Activity className="w-6 h-6 text-mint-400" />
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-white mb-1">
                  {stats.dailyVisits.toLocaleString()}
                </div>
                <div className="text-sage-200 text-sm">Daily Visits</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-6 h-6 text-mint-400" />
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-white mb-1">
                  {stats.totalUsers.toLocaleString()}
                </div>
                <div className="text-sage-200 text-sm">Total Users</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-center justify-center mb-2">
                  <Package className="w-6 h-6 text-mint-400" />
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-white mb-1">
                  {stats.herbsProcessed.toLocaleString()}
                </div>
                <div className="text-sage-200 text-sm">Herbs Processed</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-center justify-center mb-2">
                  <Globe className="w-6 h-6 text-mint-400" />
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-white mb-1">
                  {stats.activeRegions}
                </div>
                <div className="text-sage-200 text-sm">Active Regions</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-sage-50 relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-mint-100 text-mint-700 rounded-full text-sm font-medium mb-4">
              <Zap className="w-4 h-4 mr-2" />
              Why Choose HerbTrace?
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold text-sage-800 mb-6">
              Revolutionary Blockchain Technology
            </h2>
            <p className="text-xl text-sage-600 max-w-3xl mx-auto">
              Our cutting-edge platform ensures transparency, security, and
              trust in the medicinal herb supply chain through advanced
              blockchain technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group relative p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-sage-100"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}
                  ></div>
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-sage-800 mb-4 group-hover:text-mint-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sage-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-r from-sage-50 to-mint-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-sage-100 text-sage-700 rounded-full text-sm font-medium mb-4">
                <Award className="w-4 h-4 mr-2" />
                Industry Impact
              </div>
              <h2 className="text-3xl lg:text-5xl font-bold text-sage-800 mb-8 leading-tight">
                Transforming the Herbal Medicine Industry
              </h2>
              <p className="text-xl text-sage-600 mb-10 leading-relaxed">
                HerbTrace addresses critical challenges in the medicinal herb
                supply chain, providing unprecedented transparency and trust for
                all stakeholders.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <CheckCircle className="w-6 h-6 text-mint-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sage-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-mint-100 via-white to-sage-100 p-10 rounded-3xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-mint-200/30 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-sage-200/30 rounded-full blur-xl"></div>

                <div className="relative text-center">
                  <div className="text-5xl font-bold text-transparent bg-gradient-to-r from-mint-600 to-sage-600 bg-clip-text mb-4">
                    {stats.herbsProcessed.toLocaleString()}+
                  </div>
                  <div className="text-sage-700 text-lg font-semibold mb-8">
                    Herbs Traced Successfully
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                      <div className="text-2xl font-bold text-mint-600 mb-1">
                        500+
                      </div>
                      <div className="text-sm text-sage-600">
                        Active Farmers
                      </div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                      <div className="text-2xl font-bold text-mint-600 mb-1">
                        50+
                      </div>
                      <div className="text-sm text-sage-600">
                        Certified Labs
                      </div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                      <div className="text-2xl font-bold text-mint-600 mb-1">
                        25+
                      </div>
                      <div className="text-sm text-sage-600">
                        Processing Units
                      </div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                      <div className="text-2xl font-bold text-mint-600 mb-1">
                        99.9%
                      </div>
                      <div className="text-sm text-sage-600">Uptime</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-mint-100 text-mint-700 rounded-full text-sm font-medium mb-4">
              <Users className="w-4 h-4 mr-2" />
              What Our Users Say
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold text-sage-800 mb-6">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-sage-600 max-w-2xl mx-auto">
              See how HerbTrace is making a difference across the medicinal herb
              supply chain
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-sage-50 to-mint-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <div key={i} className="w-5 h-5 text-yellow-400">
                      ⭐
                    </div>
                  ))}
                </div>
                <p className="text-sage-700 mb-6 italic leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="border-t border-sage-200 pt-4">
                  <div className="font-semibold text-sage-800">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-sage-600">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-sage-800 via-sage-900 to-mint-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-sage-900/90 to-transparent"></div>

        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm text-mint-400 rounded-full text-sm font-medium mb-6">
            <TrendingUp className="w-4 h-4 mr-2" />
            Join the Revolution
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-8 leading-tight">
            Ready to Join the Future of Herbal Medicine?
          </h2>
          <p className="text-xl lg:text-2xl text-sage-200 mb-10 leading-relaxed">
            Start building trust in your herbal products today with
            blockchain-powered traceability and transparency.
          </p>

          {!user && (
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/register"
                className="group inline-flex items-center px-10 py-4 bg-gradient-to-r from-mint-500 to-mint-600 text-white font-bold rounded-xl hover:from-mint-600 hover:to-mint-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl shadow-xl text-lg"
              >
                Get Started Free
                <ChevronRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/trace"
                className="group inline-flex items-center px-10 py-4 border-2 border-sage-300/50 text-sage-200 font-bold rounded-xl hover:bg-white/10 hover:border-white/30 backdrop-blur-sm transition-all duration-300 text-lg"
              >
                Try Demo
                <Search className="ml-3 w-6 h-6 group-hover:scale-110 transition-transform" />
              </Link>
            </div>
          )}

          {user && (
            <Link
              to="/dashboard"
              className="group inline-flex items-center px-10 py-4 bg-gradient-to-r from-mint-500 to-mint-600 text-white font-bold rounded-xl hover:from-mint-600 hover:to-mint-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl shadow-xl text-lg"
            >
              Go to Dashboard
              <ChevronRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
