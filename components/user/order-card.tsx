"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Printer, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface OrderCardProps {
  order: {
    id: string
    fileName: string
    status: 'pending' | 'printing' | 'completed' | 'cancelled'
    stationaryName: string
    createdAt: Date
    totalPages: number
    totalAmount: number
  }
}

export function OrderCard({ order }: OrderCardProps) {
  const statusColors = {
    pending: "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200",
    printing: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
    completed: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
    cancelled: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
  }

  return (
    <Card className="p-4 sm:p-6 bg-card">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-0">
        <div className="flex items-start space-x-4">
          <div className="bg-primary/10 rounded-lg p-3 hidden sm:block">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold line-clamp-1">{order.fileName}</h3>
            <p className="text-sm text-muted-foreground">{order.stationaryName}</p>
          </div>
        </div>
        <Badge className={`${statusColors[order.status]} self-start sm:self-center`}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </Badge>
      </div>
      
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div className="flex items-center text-muted-foreground">
          <Clock className="mr-2 h-4 w-4 shrink-0" />
          <span className="truncate">{formatDistanceToNow(order.createdAt, { addSuffix: true })}</span>
        </div>
        <div className="flex items-center text-muted-foreground">
          <Printer className="mr-2 h-4 w-4 shrink-0" />
          <span>{order.totalPages} pages</span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Total Amount</span>
          <span className="font-semibold">₹{order.totalAmount}</span>
        </div>
      </div>
    </Card>
  )
}