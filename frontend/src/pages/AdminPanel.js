import React, { useState, useEffect } from "react";
import {
  Users,
  Activity,
  Database,
  Settings,
  Shield,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Download,
  RefreshCw,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  UserCheck,
  UserX,
  Trash2,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import LoadingSpinner, {
  CardSkeleton,
  TableSkeleton,
} from "../components/LoadingSpinner";
import StatusBadge, { UserTypeBadge } from "../components/StatusBadge";
import Modal, { ConfirmModal } from "../components/Modal";
import SearchBar from "../components/SearchBar";
import api from "../services/api";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    stats: {},
    users: [],
    recentActivity: [],
    systemHealth: {},
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userAction, setUserAction] = useState(null);
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    if (user?.userType !== "ADMIN") {
      toast.error("Access denied. Admin privileges required.");
      return;
    }

    loadAdminData();
  }, [user]);

  const loadAdminData = async () => {
    try {
      setLoading(true);

      const [statsRes, usersRes, activityRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/users", {
          params: { ...filters, search: searchQuery },
        }),
        api.get("/admin/activity"),
      ]);

      setData({
        stats: statsRes.data,
        users: usersRes.data.users || [],
        recentActivity: activityRes.data.activities || [],
        systemHealth: {
          status: "healthy",
          uptime: "99.9%",
          lastUpdated: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("Failed to load admin data:", error);
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId, action) => {
    try {
      let response;

      switch (action) {
        case "activate":
          response = await api.put(`/admin/users/${userId}/status`, {
            isActive: true,
          });
          toast.success("User activated successfully");
          break;
        case "deactivate":
          response = await api.put(`/admin/users/${userId}/status`, {
            isActive: false,
          });
          toast.success("User deactivated successfully");
          break;
        case "delete":
          response = await api.delete(`/admin/users/${userId}`);
          toast.success("User deleted successfully");
          break;
        default:
          return;
      }

      loadAdminData();
    } catch (error) {
      console.error(`Failed to ${action} user:`, error);
      toast.error(`Failed to ${action} user`);
    } finally {
      setShowConfirmModal(false);
      setUserAction(null);
    }
  };

  const exportData = async (type) => {
    try {
      const response = await api.get(`/admin/export/${type}`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `herbtrace_${type}_${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`${type} data exported successfully`);
    } catch (error) {
      console.error(`Failed to export ${type}:`, error);
      toast.error(`Failed to export ${type} data`);
    }
  };

  const StatCard = ({ title, value, icon: Icon, trend, color = "mint" }) => (
    <div className="bg-white rounded-lg shadow-soft border border-sage-100 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-sage-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-sage-900">{value}</p>
          {trend && (
            <div
              className={`flex items-center text-sm mt-1 ${
                trend.direction === "up" ? "text-green-600" : "text-red-600"
              }`}
            >
              <TrendingUp
                className={`w-4 h-4 mr-1 ${
                  trend.direction === "down" ? "transform rotate-180" : ""
                }`}
              />
              <span>{trend.percentage}% vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const UserTable = () => {
    const filteredUsers = data.users.filter((user) => {
      const matchesSearch =
        !searchQuery ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType =
        !filters.userType || user.userType === filters.userType;
      const matchesStatus =
        filters.isActive === undefined || user.isActive === filters.isActive;

      return matchesSearch && matchesType && matchesStatus;
    });

    if (loading) return <TableSkeleton rows={5} columns={6} />;

    return (
      <div className="bg-white rounded-lg shadow-soft border border-sage-100 overflow-hidden">
        <div className="p-4 border-b border-sage-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-sage-800">
              User Management
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={() => exportData("users")}
                className="flex items-center space-x-1 px-3 py-2 text-sm bg-sage-100 text-sage-700 rounded-lg hover:bg-sage-200 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button
                onClick={loadAdminData}
                className="flex items-center space-x-1 px-3 py-2 text-sm bg-mint-500 text-white rounded-lg hover:bg-mint-600 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          <SearchBar
            placeholder="Search users by name or email..."
            onSearch={setSearchQuery}
            onFilter={setFilters}
            filters={filters}
            showFilters={true}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-sage-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-sage-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-sage-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-sage-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-sage-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-sage-500 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-sage-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-sage-200">
              {filteredUsers.map((user) => (
                <tr key={user.userId} className="hover:bg-sage-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-mint-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-mint-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-sage-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-sage-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <UserTypeBadge userType={user.userType} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge
                      status={user.isActive ? "ACTIVE" : "INACTIVE"}
                      size="sm"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-sage-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-sage-500">
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleDateString()
                      : "Never"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUserModal(true);
                        }}
                        className="text-mint-600 hover:text-mint-900"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setUserAction(
                            user.isActive ? "deactivate" : "activate"
                          );
                          setShowConfirmModal(true);
                        }}
                        className={
                          user.isActive
                            ? "text-red-600 hover:text-red-900"
                            : "text-green-600 hover:text-green-900"
                        }
                      >
                        {user.isActive ? (
                          <UserX className="w-4 h-4" />
                        ) : (
                          <UserCheck className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setUserAction("delete");
                          setShowConfirmModal(true);
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="p-8 text-center text-sage-500">
            No users found matching your criteria.
          </div>
        )}
      </div>
    );
  };

  const ActivityFeed = () => (
    <div className="bg-white rounded-lg shadow-soft border border-sage-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-sage-800">
          Recent System Activity
        </h3>
        <button
          onClick={() => exportData("activity")}
          className="flex items-center space-x-1 px-3 py-2 text-sm bg-sage-100 text-sage-700 rounded-lg hover:bg-sage-200 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {data.recentActivity.length > 0 ? (
          data.recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 p-3 bg-sage-50 rounded-lg"
            >
              <div className="w-8 h-8 bg-mint-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Activity className="w-4 h-4 text-mint-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-sage-800">
                  <span className="font-medium">{activity.user}</span>{" "}
                  {activity.action}
                </p>
                <p className="text-xs text-sage-500 mt-1">
                  {new Date(activity.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sage-500 text-center py-8">No recent activity</p>
        )}
      </div>
    </div>
  );

  const SystemHealth = () => (
    <div className="bg-white rounded-lg shadow-soft border border-sage-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-sage-800">System Health</h3>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          <span className="text-sm text-sage-600">System Operational</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600 mb-1">99.9%</div>
          <div className="text-sm text-green-700">Uptime</div>
        </div>
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 mb-1">45ms</div>
          <div className="text-sm text-blue-700">Avg Response</div>
        </div>
        <div className="text-center p-4 bg-mint-50 rounded-lg">
          <div className="text-2xl font-bold text-mint-600 mb-1">0</div>
          <div className="text-sm text-mint-700">Active Issues</div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-sage-100">
        <div className="flex items-center justify-between text-sm text-sage-500">
          <span>Last updated:</span>
          <span>
            {new Date(data.systemHealth.lastUpdated).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "users", label: "Users", icon: Users },
    { id: "system", label: "System", icon: Database },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  if (loading && activeTab === "overview") {
    return (
      <div className="min-h-screen bg-cream-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="h-8 bg-sage-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-sage-100 rounded w-64"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="bg-white border-b border-sage-100 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-sage-900 mb-1">
                Admin Panel
              </h1>
              <p className="text-sage-600">
                Manage users, monitor system health, and configure settings
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-mint-600" />
              <span className="text-sm text-sage-600">
                Administrator Access
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-sage-100 rounded-lg p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-1 justify-center ${
                  activeTab === tab.id
                    ? "bg-white text-mint-700 shadow-sm"
                    : "text-sage-600 hover:text-sage-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Users"
                value={data.stats.totalUsers || 0}
                icon={Users}
                trend={{ direction: "up", percentage: 12 }}
                color="mint"
              />
              <StatCard
                title="Active Herbs"
                value={data.stats.activeHerbs || 0}
                icon={Activity}
                trend={{ direction: "up", percentage: 8 }}
                color="sage"
              />
              <StatCard
                title="Tests Completed"
                value={data.stats.testsCompleted || 0}
                icon={Shield}
                trend={{ direction: "up", percentage: 15 }}
                color="blue"
              />
              <StatCard
                title="System Alerts"
                value={data.stats.systemAlerts || 0}
                icon={AlertTriangle}
                color="red"
              />
            </div>

            {/* Charts and Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ActivityFeed />
              <SystemHealth />
            </div>
          </div>
        )}

        {activeTab === "users" && <UserTable />}

        {activeTab === "system" && (
          <div className="space-y-8">
            <SystemHealth />

            {/* System Configuration */}
            <div className="bg-white rounded-lg shadow-soft border border-sage-100 p-6">
              <h3 className="text-lg font-semibold text-sage-800 mb-4">
                System Configuration
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-sage-100">
                    <div>
                      <div className="font-medium text-sage-800">
                        Blockchain Network
                      </div>
                      <div className="text-sm text-sage-600">
                        HerbTrace Network Status
                      </div>
                    </div>
                    <StatusBadge status="ACTIVE" size="sm" />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-sage-100">
                    <div>
                      <div className="font-medium text-sage-800">
                        API Gateway
                      </div>
                      <div className="text-sm text-sage-600">
                        External API connections
                      </div>
                    </div>
                    <StatusBadge status="ACTIVE" size="sm" />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-sage-100">
                    <div>
                      <div className="font-medium text-sage-800">Database</div>
                      <div className="text-sm text-sage-600">
                        MongoDB cluster status
                      </div>
                    </div>
                    <StatusBadge status="ACTIVE" size="sm" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-sage-100">
                    <div>
                      <div className="font-medium text-sage-800">
                        Email Service
                      </div>
                      <div className="text-sm text-sage-600">
                        Notification delivery
                      </div>
                    </div>
                    <StatusBadge status="ACTIVE" size="sm" />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-sage-100">
                    <div>
                      <div className="font-medium text-sage-800">
                        File Storage
                      </div>
                      <div className="text-sm text-sage-600">
                        Document and image storage
                      </div>
                    </div>
                    <StatusBadge status="ACTIVE" size="sm" />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-sage-100">
                    <div>
                      <div className="font-medium text-sage-800">Analytics</div>
                      <div className="text-sm text-sage-600">
                        Usage tracking and reporting
                      </div>
                    </div>
                    <StatusBadge status="ACTIVE" size="sm" />
                  </div>
                </div>
              </div>
            </div>

            {/* Data Export Section */}
            <div className="bg-white rounded-lg shadow-soft border border-sage-100 p-6">
              <h3 className="text-lg font-semibold text-sage-800 mb-4">
                Data Export
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => exportData("users")}
                  className="flex items-center justify-center space-x-2 p-4 border border-sage-200 rounded-lg hover:bg-sage-50 transition-colors"
                >
                  <Download className="w-5 h-5 text-sage-600" />
                  <span className="font-medium text-sage-800">
                    Export Users
                  </span>
                </button>

                <button
                  onClick={() => exportData("herbs")}
                  className="flex items-center justify-center space-x-2 p-4 border border-sage-200 rounded-lg hover:bg-sage-50 transition-colors"
                >
                  <Download className="w-5 h-5 text-sage-600" />
                  <span className="font-medium text-sage-800">
                    Export Herbs
                  </span>
                </button>

                <button
                  onClick={() => exportData("transactions")}
                  className="flex items-center justify-center space-x-2 p-4 border border-sage-200 rounded-lg hover:bg-sage-50 transition-colors"
                >
                  <Download className="w-5 h-5 text-sage-600" />
                  <span className="font-medium text-sage-800">
                    Export Transactions
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-8">
            {/* Application Settings */}
            <div className="bg-white rounded-lg shadow-soft border border-sage-100 p-6">
              <h3 className="text-lg font-semibold text-sage-800 mb-4">
                Application Settings
              </h3>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sage-800">
                      User Registration
                    </div>
                    <div className="text-sm text-sage-600">
                      Allow new users to register
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      defaultChecked
                    />
                    <div className="w-11 h-6 bg-sage-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-mint-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-mint-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sage-800">
                      Email Notifications
                    </div>
                    <div className="text-sm text-sage-600">
                      Send system notifications via email
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      defaultChecked
                    />
                    <div className="w-11 h-6 bg-sage-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-mint-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-mint-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sage-800">
                      Public Tracing
                    </div>
                    <div className="text-sm text-sage-600">
                      Allow public herb tracing without login
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      defaultChecked
                    />
                    <div className="w-11 h-6 bg-sage-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-mint-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-mint-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sage-800">
                      Data Retention
                    </div>
                    <div className="text-sm text-sage-600">
                      Automatically archive old records
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-sage-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-mint-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-mint-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white rounded-lg shadow-soft border border-sage-100 p-6">
              <h3 className="text-lg font-semibold text-sage-800 mb-4">
                Security Settings
              </h3>

              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <span className="font-medium text-yellow-800">
                      Security Notice
                    </span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    Security settings should only be modified by authorized
                    administrators. Changes may affect system functionality.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-sage-700 mb-2">
                        Session Timeout (minutes)
                      </label>
                      <input
                        type="number"
                        defaultValue="60"
                        className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-sage-700 mb-2">
                        Max Login Attempts
                      </label>
                      <input
                        type="number"
                        defaultValue="5"
                        className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-sage-700 mb-2">
                        Password Expiry (days)
                      </label>
                      <input
                        type="number"
                        defaultValue="90"
                        className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-sage-700 mb-2">
                        Lockout Duration (minutes)
                      </label>
                      <input
                        type="number"
                        defaultValue="30"
                        className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button className="px-4 py-2 bg-mint-500 text-white rounded-lg hover:bg-mint-600 transition-colors">
                    Save Security Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      <Modal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        title="User Details"
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-mint-100 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-mint-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-sage-800">
                  {selectedUser.name}
                </h3>
                <p className="text-sage-600">{selectedUser.email}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <UserTypeBadge userType={selectedUser.userType} />
                  <StatusBadge
                    status={selectedUser.isActive ? "ACTIVE" : "INACTIVE"}
                    size="sm"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-sage-700">User ID:</span>
                <span className="ml-2 text-sage-600 font-mono">
                  {selectedUser.userId}
                </span>
              </div>
              <div>
                <span className="font-medium text-sage-700">Phone:</span>
                <span className="ml-2 text-sage-600">
                  {selectedUser.phone || "N/A"}
                </span>
              </div>
              <div>
                <span className="font-medium text-sage-700">Joined:</span>
                <span className="ml-2 text-sage-600">
                  {new Date(selectedUser.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="font-medium text-sage-700">Last Login:</span>
                <span className="ml-2 text-sage-600">
                  {selectedUser.lastLogin
                    ? new Date(selectedUser.lastLogin).toLocaleDateString()
                    : "Never"}
                </span>
              </div>
            </div>

            {selectedUser.address && (
              <div>
                <span className="font-medium text-sage-700">Address:</span>
                <p className="text-sage-600 mt-1">
                  {[
                    selectedUser.address.street,
                    selectedUser.address.city,
                    selectedUser.address.district,
                    selectedUser.address.state,
                    selectedUser.address.pincode,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <button
                onClick={() => {
                  setUserAction(
                    selectedUser.isActive ? "deactivate" : "activate"
                  );
                  setShowUserModal(false);
                  setShowConfirmModal(true);
                }}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                  selectedUser.isActive
                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}
              >
                {selectedUser.isActive ? "Deactivate User" : "Activate User"}
              </button>
              <button
                onClick={() => setShowUserModal(false)}
                className="flex-1 px-4 py-2 bg-sage-100 text-sage-700 rounded-lg hover:bg-sage-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => handleUserAction(selectedUser?.userId, userAction)}
        title="Confirm Action"
        message={
          userAction === "activate"
            ? `Are you sure you want to activate ${selectedUser?.name}?`
            : userAction === "deactivate"
            ? `Are you sure you want to deactivate ${selectedUser?.name}? They will no longer be able to access the system.`
            : `Are you sure you want to delete ${selectedUser?.name}? This action cannot be undone.`
        }
        confirmText={userAction === "delete" ? "Delete" : "Confirm"}
        confirmButtonClass={
          userAction === "delete"
            ? "bg-red-500 hover:bg-red-600 text-white"
            : userAction === "activate"
            ? "bg-green-500 hover:bg-green-600 text-white"
            : "bg-yellow-500 hover:bg-yellow-600 text-white"
        }
      />
    </div>
  );
};

export default AdminPanel;
