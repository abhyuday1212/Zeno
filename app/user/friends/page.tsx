"use client";

import React, { useState } from "react";
import { Users, Send, Inbox, Heart } from "lucide-react";
import UserList from "@/components/user/friendsTab/UserList";
import SentRequests from "@/components/user/friendsTab/SentRequests";
import ReceivedRequests from "@/components/user/friendsTab/ReceivedRequests";
import FriendsList from "@/components/user/friendsTab/MyFriends";

type TabType = "suggested" | "sent" | "received" | "friends";

const FriendsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("suggested");

  const tabs = [
    { id: "suggested" as TabType, label: "Suggested Users", icon: Users, count: 4 },
    { id: "sent" as TabType, label: "Sent Requests", icon: Send, count: 3 },
    { id: "received" as TabType, label: "Received Requests", icon: Inbox, count: 3 },
    { id: "friends" as TabType, label: "Friends", icon: Heart, count: 4 },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "suggested":
        return <UserList />;
      case "sent":
        return <SentRequests />;
      case "received":
        return <ReceivedRequests />;
      case "friends":
        return <FriendsList />;
      default:
        return <UserList />;
    }
  };

  return (
    <main className="min-h-screen bg-background text-gray-900 dark:text-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Friends</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Manage your connections and discover new friends
          </p>
        </header>

        {/* Tab Navigation */}
        <nav
          className="border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm mb-6"
          aria-label="Friendship Tabs"
        >
          <ul
            className="
      grid 
      grid-cols-1 
      xs:grid-cols-2 
      md:grid-cols-4 
      gap-px 
      bg-gray-200 
      dark:bg-gray-700 
      rounded-xl 
      overflow-hidden
    "
          >
            {tabs.map(({ id, label, icon: Icon }) => {
              const isActive = activeTab === id;
              return (
                <li key={id} className="w-full h-full">
                  <button
                    onClick={() => setActiveTab(id)}
                    className={`
              flex items-center gap-3 w-full h-full px-4 py-3 
              text-left text-sm sm:text-base font-medium transition-colors 
              focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
              ${
                isActive
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200"
                  : "bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }
            `}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span>{label}</span>
                    {/* {count > 0 && (
                      <span
                        className={`ml-auto px-2 py-1 text-xs font-semibold rounded-full ${
                          isActive
                            ? "bg-blue-200 text-blue-800 dark:bg-blue-700 dark:text-white"
                            : "bg-gray-300 text-gray-700 dark:bg-gray-600 dark:text-gray-200"
                        }`}
                      >
                        {count}
                      </span>
                    )} */}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Content */}
        <section
          aria-labelledby="tab-content"
          className="transition-all duration-300 ease-in-out"
        >
          {renderContent()}
        </section>
      </div>
    </main>
  );
};

export default FriendsPage;
