import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
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
  AlertCircle,
  Eye,
  Search,
  Filter,
} from "lucide-react";
import HerbCard, { HerbCardSkeleton } from "../components/HerbCard";
import StatusBadge, { UserTypeBadge } from "../components/StatusBadge";
import LoadingSpinner from "../components/LoadingSpinner";
import { TimelineCompact } from "../components/Timeline";
import api from "../services/api";

const Dashboard = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [recentHerbs, setRecentHerbs] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      // Load different data based on user type
      const promises = [loadRecentHerbs()];

      if (user.userType === "ADMIN") {
        promises.push(loadStats());
      }

      await Promise.all(promises);
    } catch (error) {
      console.error("Dashboard error:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const loadRecentHerbs = async () => {
    try {
      const response =
        user.userType === "ADMIN"
          ? await api.get("/herbs?limit=6")
          : await api.get("/herbs/my-herbs");

      setRecentHerbs(response.data.herbs || response.data.data || []);
    } catch (error) {
      console.error("Failed to load herbs:", error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await api.get("/herbs/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const getDashboardActions = () => {
    const actions = {
      FARMER: [
        {
          title: "Collect Herbs",
          description: "Record new herb collection",
          icon: Leaf,
          path: "/collect",
          color: "bg-green-500 hover:bg-green-600",
        },
      ],
      LAB: [
        {
          title: "Quality Test",
          description: "Perform quality testing",
          icon: TestTube,
          path: "/quality-test",
          color: "bg-blue-500 hover:bg-blue-600",
        },
      ],
      PROCESSOR: [
        {
          title: "Process Herbs",
          description: "Add processing steps",
          icon: Settings,
          path: "/process",
          color: "bg-purple-500 hover:bg-purple-600",
        },
      ],
      CONSUMER: [
        {
          title: "Trace Herb",
          description: "Verify herb authenticity",
          icon: Search,
          path: "/trace",
          color: "bg-mint-500 hover:bg-mint-600",
        },
      ],
      ADMIN: [
        {
          title: "Admin Panel",
          description: "Manage system",
          icon: Users,
          path: "/admin",
          color: "bg-red-500 hover:bg-red-600",
        },
      ],
    };

    return actions[user.userType] || [];
  };

  const getQuickStats = () => {
    if (user.userType === "ADMIN" && stats.totalHerbs !== undefined) {
      return [
        {
          title: "Total Herbs",
          value: stats.totalHerbs,
          icon: Package,
          color: "text-green-600",
          bgColor: "bg-green-50",
        },
        {
          title: "Active Users",
          value: "N/A", // Would need separate endpoint
          icon: Users,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
        },
        {
          title: "Completed Tests",
          value: stats.statusBreakdown?.tested || 0,
          icon: TestTube,
          color: "text-purple-600",
          bgColor: "bg-purple-50",
        },
        {
          title: "Processing Steps",
          value: stats.statusBreakdown?.processed || 0,
          icon: Settings,
          color: "text-orange-600",
          bgColor: "bg-orange-50",
        },
      ];
    }

    // User-specific stats
    const herbCount = recentHerbs.length;
    return [
      {
        title: "My Herbs",
        value: herbCount,
        icon: Package,
        color: "text-green-600",
        bgColor: "bg-green-50",
      },
      {
        title: "This Month",
        value: recentHerbs.filter(
          (h) =>
            new Date(h.createdAt) >
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        ).length,
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
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="h-8 bg-sage-200 rounded w-64 mb-4 animate-pulse"></div>
            <div className="h-4 bg-sage-100 rounded w-96 animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-lg shadow-soft border border-sage-100 animate-pulse"
              >
                <div className="h-12 w-12 bg-sage-200 rounded-lg mb-4"></div>
                <div className="h-6 bg-sage-200 rounded w-16 mb-2"></div>
                <div className="h-4 bg-sage-100 rounded w-24"></div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <HerbCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const quickStats = getQuickStats();
  const dashboardActions = getDashboardActions();

  return (
    <div className="min-h-screen bg-cream-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
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
              {dashboardActions.map((action, index) => {
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Herbs */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-soft border border-sage-100">
              <div className="p-6 border-b border-sage-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-sage-800">
                    {user.userType === "ADMIN" ? "Recent Herbs" : "My Herbs"}
                  </h2>
                  <Link
                    to="/herbs"
                    className="flex items-center space-x-1 text-mint-600 hover:text-mint-700 text-sm font-medium transition-colors"
                  >
                    <span>View all</span>
                    <Eye className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="p-6">
                {recentHerbs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recentHerbs.slice(0, 4).map((herb) => (
                      <HerbCard key={herb.herbId} herb={herb} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-sage-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-sage-600 mb-2">
                      No herbs found
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

          {/* Activity & Quick Links */}
          <div className="space-y-6">
            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-soft border border-sage-100 p-6">
              <h3 className="text-lg font-semibold text-sage-800 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link
                  to="/trace"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-sage-50 transition-colors"
                >
                  <div className="p-2 bg-mint-100 rounded-lg">
                    <Search className="w-4 h-4 text-mint-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sage-800">Trace Herb</p>
                    <p className="text-sm text-sage-600">Verify authenticity</p>
                  </div>
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-sage-50 transition-colors"
                >
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sage-800">My Profile</p>
                    <p className="text-sm text-sage-600">Update information</p>
                  </div>
                </Link>

                {user.userType === "ADMIN" && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-sage-50 transition-colors"
                  >
                    <div className="p-2 bg-red-100 rounded-lg">
                      <BarChart3 className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sage-800">Admin Panel</p>
                      <p className="text-sm text-sage-600">System management</p>
                    </div>
                  </Link>
                )}
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-lg shadow-soft border border-sage-100 p-6">
              <h3 className="text-lg font-semibold text-sage-800 mb-4">
                System Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sage-600">Blockchain Network</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600 font-medium">
                      Online
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sage-600">Database</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600 font-medium">
                      Online
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sage-600">API Services</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600 font-medium">
                      Online
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-800 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  All systems operational
                </p>
              </div>
            </div>

            {/* Recent Activity */}
            {user.userType === "ADMIN" && stats.recentTransactions && (
              <div className="bg-white rounded-lg shadow-soft border border-sage-100 p-6">
                <h3 className="text-lg font-semibold text-sage-800 mb-4">
                  Recent Activity
                </h3>
                {stats.recentTransactions.length > 0 ? (
                  <div className="space-y-3">
                    {stats.recentTransactions
                      .slice(0, 5)
                      .map((transaction, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-sage-25"
                        >
                          <div className="p-2 bg-mint-100 rounded-lg">
                            <Package className="w-3 h-3 text-mint-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-sage-800 truncate">
                              {transaction.eventType.replace("_", " ")}
                            </p>
                            <p className="text-xs text-sage-600">
                              {transaction.HerbBatch?.herbId} •{" "}
                              {new Date(
                                transaction.createdAt
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <StatusBadge
                            status={transaction.status}
                            size="sm"
                            showIcon={false}
                          />
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-sm text-sage-500">No recent activity</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
