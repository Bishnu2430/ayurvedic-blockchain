import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Plus,
  Leaf,
  TestTube,
  Settings,
  BarChart3,
  TrendingUp,
  Package,
  Users,
  Clock,
  CheckCircle,
  Eye,
  Search,
} from "lucide-react";
import HerbCard from "../components/HerbCard";
import StatusBadge, { UserTypeBadge } from "../components/StatusBadge";

// Static herb data
const staticHerbs = [
  {
    herbId: "HERB001",
    name: "Tulsi",
    status: "COLLECTED",
    createdAt: "2025-06-10T10:00:00Z",
    description: "Medicinal herb",
    quantity: 50,
  },
  {
    herbId: "HERB002",
    name: "Ashwagandha",
    status: "TESTED",
    createdAt: "2025-07-15T12:30:00Z",
    description: "Root herb for stress relief",
    quantity: 30,
  },
  {
    herbId: "HERB003",
    name: "Neem",
    status: "PROCESSED",
    createdAt: "2025-08-20T09:20:00Z",
    description: "Leaves for skin care",
    quantity: 40,
  },
  {
    herbId: "HERB004",
    name: "Amla",
    status: "DISTRIBUTED",
    createdAt: "2025-09-05T14:10:00Z",
    description: "Vitamin C rich fruit",
    quantity: 25,
  },
  {
    herbId: "HERB005",
    name: "Brahmi",
    status: "COLLECTED",
    createdAt: "2025-09-18T11:50:00Z",
    description: "Brain tonic herb",
    quantity: 60,
  },
  {
    herbId: "HERB006",
    name: "Ginger",
    status: "TESTED",
    createdAt: "2025-05-22T08:15:00Z",
    description: "Spicy root herb",
    quantity: 35,
  },
  {
    herbId: "HERB007",
    name: "Mint",
    status: "PROCESSED",
    createdAt: "2025-04-11T16:40:00Z",
    description: "Refreshing leaves",
    quantity: 45,
  },
  {
    herbId: "HERB008",
    name: "Cinnamon",
    status: "COLLECTED",
    createdAt: "2025-03-30T10:05:00Z",
    description: "Spicy bark",
    quantity: 20,
  },
  {
    herbId: "HERB009",
    name: "Saffron",
    status: "DISTRIBUTED",
    createdAt: "2025-02-14T13:25:00Z",
    description: "Rare spice",
    quantity: 15,
  },
  {
    herbId: "HERB010",
    name: "Ginseng",
    status: "COLLECTED",
    createdAt: "2025-01-09T09:45:00Z",
    description: "Root tonic",
    quantity: 50,
  },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [recentHerbs, setRecentHerbs] = useState([]);

  useEffect(() => {
    // Simulate API delay
    setTimeout(() => {
      setRecentHerbs(staticHerbs);
      setIsLoading(false);
    }, 500);
  }, []);

  // Filter herbs created this month
  const thisMonthHerbs = recentHerbs.filter((h) => {
    const createdAt = new Date(h.createdAt);
    const now = new Date();
    return (
      createdAt.getMonth() === now.getMonth() &&
      createdAt.getFullYear() === now.getFullYear()
    );
  });

  // Quick stats
  const quickStats = [
    {
      title: "My Herbs",
      value: recentHerbs.length,
      icon: Package,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "This Month",
      value: thisMonthHerbs.length,
      icon: TrendingUp,
      color: "text-mint-600",
      bgColor: "bg-mint-50",
    },
    {
      title: "Completed",
      value: recentHerbs.filter(
        (h) => h.status === "PROCESSED" || h.status === "DISTRIBUTED"
      ).length,
      icon: CheckCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "In Progress",
      value: recentHerbs.filter(
        (h) => h.status === "COLLECTED" || h.status === "TESTED"
      ).length,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  const dashboardActions = {
    FARMER: [
      {
        title: "Collect Herbs",
        icon: Leaf,
        path: "/collect",
        color: "bg-green-500 hover:bg-green-600",
      },
    ],
    LAB: [
      {
        title: "Quality Test",
        icon: TestTube,
        path: "/quality-test",
        color: "bg-blue-500 hover:bg-blue-600",
      },
    ],
    PROCESSOR: [
      {
        title: "Process Herbs",
        icon: Settings,
        path: "/process",
        color: "bg-purple-500 hover:bg-purple-600",
      },
    ],
    CONSUMER: [
      {
        title: "Trace Herb",
        icon: Search,
        path: "/trace",
        color: "bg-mint-500 hover:bg-mint-600",
      },
    ],
    ADMIN: [
      {
        title: "Admin Panel",
        icon: Users,
        path: "/admin",
        color: "bg-red-500 hover:bg-red-600",
      },
    ],
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="loading-spinner"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-cream-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-sage-800">
              Welcome back, {user.name}!
            </h1>
            <div className="flex items-center space-x-2 mt-2">
              <UserTypeBadge userType={user.userType} />
              <span className="text-sage-600">•</span>
              <span className="text-sage-600">
                {new Date().toLocaleDateString("en-IN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex space-x-3">
            {(dashboardActions[user.userType] || []).map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={index}
                  to={action.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-colors ${action.color}`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{action.title}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-soft border border-sage-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-sage-800">
                      {stat.value}
                    </p>
                    <p className="text-sm text-sage-600 mt-1">{stat.title}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* My Herbs Section (This Month) */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-soft border border-sage-100">
            <div className="p-6 border-b border-sage-100 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-sage-800">
                My Herbs (This Month)
              </h2>
              {/* Keep the View All link */}
              <Link
                to="/my-herbs"
                className="flex items-center space-x-1 text-mint-600 hover:text-mint-700 text-sm font-medium transition-colors"
              >
                <span>View all</span>
                <Eye className="w-4 h-4" />
              </Link>
            </div>

            <div className="p-6">
              {thisMonthHerbs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {thisMonthHerbs.map((herb) => (
                    <HerbCard key={herb.herbId} herb={herb} hideDetails />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-sage-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-sage-600 mb-2">
                    No herbs found this month
                  </h3>
                  <p className="text-sage-500 mb-4">
                    {user.userType === "FARMER"
                      ? "Start by collecting your first herb batch"
                      : "No herb batches available yet"}
                  </p>
                  {user.userType === "FARMER" && (
                    <Link
                      to="/collect"
                      className="inline-flex items-center space-x-2 bg-mint-500 text-white px-4 py-2 rounded-lg hover:bg-mint-600 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Collect Herbs</span>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
