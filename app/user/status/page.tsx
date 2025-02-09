"use client"

import { useState } from "react"
import { OrderCard } from "@/components/user/order-card";
import { OrderFilters } from "@/components/user/order-filters";

// Dummy data for demonstration
const DUMMY_ORDERS = [
  {
    id: "1",
    fileName: "Assignment-1.pdf",
    status: "pending",
    stationaryName: "Campus Print Shop",
    createdAt: new Date(2024, 2, 15),
    totalPages: 12,
    totalAmount: 24
  },
  {
    id: "2",
    fileName: "Project-Report.pdf",
    status: "printing",
    stationaryName: "Student Copy Center",
    createdAt: new Date(2024, 2, 14),
    totalPages: 45,
    totalAmount: 90
  },
  {
    id: "3",
    fileName: "Research-Paper.pdf",
    status: "completed",
    stationaryName: "Campus Print Shop",
    createdAt: new Date(2024, 2, 10),
    totalPages: 20,
    totalAmount: 40
  }
] as const

export default function OrderStatus() {
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortOrder, setSortOrder] = useState("newest")

  const filteredOrders = DUMMY_ORDERS
    .filter(order => statusFilter === "all" || order.status === statusFilter)
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return b.createdAt.getTime() - a.createdAt.getTime()
      }
      return a.createdAt.getTime() - b.createdAt.getTime()
    })

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl font-bold">Order Status</h1>
            <p className="text-muted-foreground">Track your printing orders</p>
          </div>
          <OrderFilters
            onStatusChange={setStatusFilter}
            onSortChange={setSortOrder}
          />
        </div>

        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
          {filteredOrders.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No orders found
            </div>
          )}
        </div>
      </div>
    </div>
  )
}