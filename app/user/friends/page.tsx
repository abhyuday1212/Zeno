import { Suspense } from "react";
import FriendsClient from "./FriendsClient";
import UserList from "@/components/user/UserList";

export default function FriendsPage() {
  return (
    <div className="min-h-screen bg-background">
      <FriendsClient />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <Suspense fallback={<UserListSkeleton />}>
          <UserList />
        </Suspense>
      </div>
    </div>
  );
}

function UserListSkeleton() {
  return (
    <div className="mt-2 bg-card rounded-xl shadow-sm border border-border overflow-hidden">
      <div className="p-6 border-b border-border">
        <div className="h-6 bg-muted rounded w-48 mb-2"></div>
        <div className="h-4 bg-muted rounded w-64"></div>
      </div>
      <div className="divide-y divide-border">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-muted rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-muted rounded w-32 mb-2"></div>
                <div className="h-3 bg-muted rounded w-48"></div>
              </div>
              <div className="w-24 h-8 bg-muted rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
