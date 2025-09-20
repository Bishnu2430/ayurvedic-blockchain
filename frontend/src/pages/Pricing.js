import React from "react";
import { Link } from "react-router-dom";
import {
  Check,
  X,
  Star,
  Leaf,
  Zap,
  Crown,
  ArrowRight,
  Users,
  Shield,
  BarChart3,
} from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      period: "Forever",
      description: "Perfect for small farmers and individual users",
      icon: Leaf,
      color: "from-green-500 to-emerald-600",
      popular: false,
      features: [
        "Up to 100 herb batches/month",
        "Basic traceability features",
        "QR code generation",
        "Email support",
        "Community access",
      ],
      limitations: [
        "Advanced analytics",
        "Priority support",
        "Custom branding",
        "API access",
      ],
      ctaText: "Get Started Free",
      ctaLink: "/register",
    },
    {
      name: "Professional",
      price: "₹2,999",
      period: "per month",
      description: "Ideal for labs, processors, and medium businesses",
      icon: Zap,
      color: "from-blue-500 to-cyan-600",
      popular: true,
      features: [
        "Up to 10,000 herb batches/month",
        "Advanced traceability & analytics",
        "Custom QR codes with branding",
        "Priority email & chat support",
        "API access & integrations",
        "Multi-user accounts",
        "Custom certificates",
        "Bulk operations",
      ],
      limitations: ["White-label solution", "Dedicated support manager"],
      ctaText: "Start Free Trial",
      ctaLink: "/register",
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "Contact us",
      description: "Tailored solution for large organizations",
      icon: Crown,
      color: "from-purple-500 to-violet-600",
      popular: false,
      features: [
        "Unlimited herb batches",
        "Complete white-label solution",
        "Dedicated support manager",
        "Custom integrations & APIs",
        "Advanced security features",
        "Training & onboarding",
        "SLA guarantees",
        "Custom development",
        "Multi-region deployment",
      ],
      limitations: [],
      ctaText: "Contact Sales",
      ctaLink: "/contact",
    },
  ];

  const faqs = [
    {
      question: "Is there really a free plan?",
      answer:
        "Yes! Our Starter plan is completely free forever with up to 100 herb batches per month. Perfect for small farmers and individual users to get started.",
    },
    {
      question: "Can I upgrade or downgrade anytime?",
      answer:
        "Absolutely! You can change your plan anytime from your dashboard. Upgrades take effect immediately, while downgrades apply at the end of your billing cycle.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, debit cards, UPI, net banking, and bank transfers. Enterprise customers can also pay via invoice.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Yes, we use enterprise-grade security with blockchain technology ensuring your data is immutable and secure. We're also compliant with data protection regulations.",
    },
    {
      question: "Do you offer discounts for NGOs?",
      answer:
        "Yes! We offer special pricing for non-profit organizations, educational institutions, and social enterprises. Contact us to learn more.",
    },
  ];

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-sage-900 to-mint-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 text-2xl font-bold mb-4">
            <div className="p-2 bg-mint-600 rounded-lg">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <span>HerbTrace</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl lg:text-2xl text-sage-200 max-w-3xl mx-auto mb-8">
            Choose the perfect plan for your needs. Start free and scale as you
            grow.
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-mint-100/20 backdrop-blur-sm text-mint-300 rounded-full text-sm font-medium">
            <Star className="w-4 h-4 mr-2" />
            Trusted by 15,000+ users across India
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              return (
                <div
                  key={index}
                  className={`relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
                    plan.popular
                      ? "ring-4 ring-mint-500/20 scale-105"
                      : "hover:scale-105"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-mint-500 to-mint-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                        Most Popular
                      </div>
                    </div>
                  )}

                  <div className="p-8">
                    {/* Plan Header */}
                    <div className="text-center mb-8">
                      <div
                        className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg`}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-sage-800 mb-2">
                        {plan.name}
                      </h3>
                      <p className="text-sage-600 mb-4">{plan.description}</p>
                      <div className="mb-4">
                        <span className="text-4xl font-bold text-sage-800">
                          {plan.price}
                        </span>
                        {plan.period !== "Contact us" && (
                          <span className="text-sage-500 ml-2">
                            /{plan.period}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="space-y-4 mb-8">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start space-x-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sage-700">{feature}</span>
                        </div>
                      ))}
                      {plan.limitations.map((limitation, idx) => (
                        <div
                          key={idx}
                          className="flex items-start space-x-3 opacity-50"
                        >
                          <X className="w-5 h-5 text-sage-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sage-500">{limitation}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <Link
                      to={plan.ctaLink}
                      className={`w-full flex items-center justify-center px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${
                        plan.popular
                          ? "bg-gradient-to-r from-mint-500 to-mint-600 text-white hover:from-mint-600 hover:to-mint-700 shadow-lg"
                          : "bg-sage-100 text-sage-800 hover:bg-sage-200"
                      }`}
                    >
                      {plan.ctaText}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-sage-800 mb-6">
              Why Choose HerbTrace?
            </h2>
            <p className="text-xl text-sage-600 max-w-2xl mx-auto">
              Powerful features designed specifically for the medicinal herb
              industry
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-sage-50 to-mint-50 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-mint-500 to-sage-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-sage-800 mb-4">
                Blockchain Security
              </h3>
              <p className="text-sage-600">
                Immutable records powered by Hyperledger Fabric ensure complete
                data integrity and transparency.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-sage-50 to-mint-50 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-sage-800 mb-4">
                Advanced Analytics
              </h3>
              <p className="text-sage-600">
                Get detailed insights into your supply chain with comprehensive
                analytics and reporting.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-sage-50 to-mint-50 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-sage-800 mb-4">
                Multi-Stakeholder Network
              </h3>
              <p className="text-sage-600">
                Connect farmers, labs, processors, and consumers in one
                transparent ecosystem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-sage-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-sage-800 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-sage-600">
              Got questions? We've got answers.
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <h3 className="text-lg font-bold text-sage-800 mb-3">
                  {faq.question}
                </h3>
                <p className="text-sage-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-sage-800 to-mint-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Transform Your Herb Supply Chain?
          </h2>
          <p className="text-xl text-sage-200 mb-8">
            Join thousands of farmers, labs, and processors already using
            HerbTrace
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-mint-500 to-mint-600 text-white font-semibold rounded-xl hover:from-mint-600 hover:to-mint-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/trace"
              className="inline-flex items-center px-8 py-4 border-2 border-sage-300 text-sage-200 font-semibold rounded-xl hover:bg-white/10 hover:border-white/30 transition-colors"
            >
              Try Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
