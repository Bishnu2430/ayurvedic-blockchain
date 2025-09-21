import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";

const MyHerbs = () => {
  const [herbs, setHerbs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Static herb data
  const staticHerbs = [
    {
      herbId: "HERB001",
      name: "Tulsi",
      status: "COLLECTED",
      createdAt: "2025-06-10T10:00:00Z",
      quantity: 50,
    },
    {
      herbId: "HERB002",
      name: "Ashwagandha",
      status: "TESTED",
      createdAt: "2025-07-15T12:30:00Z",
      quantity: 30,
    },
    {
      herbId: "HERB003",
      name: "Neem",
      status: "PROCESSED",
      createdAt: "2025-08-20T09:20:00Z",
      quantity: 40,
    },
    {
      herbId: "HERB004",
      name: "Amla",
      status: "DISTRIBUTED",
      createdAt: "2025-09-05T14:10:00Z",
      quantity: 25,
    },
    {
      herbId: "HERB005",
      name: "Brahmi",
      status: "COLLECTED",
      createdAt: "2025-09-18T11:50:00Z",
      quantity: 60,
    },
    {
      herbId: "HERB006",
      name: "Ginger",
      status: "TESTED",
      createdAt: "2025-05-22T08:15:00Z",
      quantity: 35,
    },
    {
      herbId: "HERB007",
      name: "Mint",
      status: "PROCESSED",
      createdAt: "2025-04-11T16:40:00Z",
      quantity: 45,
    },
    {
      herbId: "HERB008",
      name: "Cinnamon",
      status: "COLLECTED",
      createdAt: "2025-03-30T10:05:00Z",
      quantity: 20,
    },
    {
      herbId: "HERB009",
      name: "Saffron",
      status: "DISTRIBUTED",
      createdAt: "2025-02-14T13:25:00Z",
      quantity: 15,
    },
    {
      herbId: "HERB010",
      name: "Ginseng",
      status: "COLLECTED",
      createdAt: "2025-01-09T09:45:00Z",
      quantity: 50,
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setHerbs(staticHerbs);
      setIsLoading(false);
    }, 500);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-sage-800">My Herbs</h1>
          <Link
            to="/dashboard"
            className="text-mint-600 hover:text-mint-700 font-medium"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Herb Cards */}
        {herbs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {herbs.map((herb) => (
              <div
                key={herb.herbId}
                className="bg-white p-4 rounded-lg shadow-soft border border-sage-100 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold text-sage-800 mb-1">
                  {herb.name}
                </h3>

                {/* Status Badge */}
                <div className="mb-2">
                  <StatusBadge status={herb.status} />
                </div>

                <p className="text-sm text-sage-600">
                  Quantity: <span className="font-medium">{herb.quantity}</span>
                </p>
                <p className="text-sm text-sage-500 mt-2">
                  Collected:{" "}
                  {new Date(herb.createdAt).toLocaleString("en-IN", {
                    month: "long",
                    year: "numeric",
                    day: "numeric",
                  })}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-sage-600">No herbs found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyHerbs;
