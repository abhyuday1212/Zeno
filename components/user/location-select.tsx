"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { MapPin, Store } from "lucide-react"

const DUMMY_STATIONARIES = [
  {
    id: 1,
    name: "Campus Print Shop",
    rating: 4.5,
    distance: "0.2 km",
    pricing: "₹2/page (B&W), ₹10/page (Color)"
  },
  {
    id: 2,
    name: "Student Copy Center",
    rating: 4.2,
    distance: "0.5 km",
    pricing: "₹2/page (B&W), ₹12/page (Color)"
  }
]

export function LocationSelect({ onNext }: { onNext: (data: any) => void }) {
  const [selectedCollege] = useState("Demo College")
  const [showStationaries, setShowStationaries] = useState(false)
  const [selectedStationary, setSelectedStationary] = useState<number | null>(null)

  const handleStationarySelect = (id: number) => {
    setSelectedStationary(id)
    setShowStationaries(false)
    onNext({ college: selectedCollege, stationaryId: id })
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Selected College</h3>
            <p className="text-muted-foreground">{selectedCollege}</p>
          </div>
          <MapPin className="h-6 w-6 text-muted-foreground" />
        </div>
      </Card>

      <Button className="w-full" onClick={() => setShowStationaries(true)}>
        <Store className="mr-2 h-4 w-4" />
        Select Stationary
      </Button>

      <Dialog open={showStationaries} onOpenChange={setShowStationaries}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select a Stationary</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {DUMMY_STATIONARIES.map((stationary) => (
              <Card
                key={stationary.id}
                className={`p-4 cursor-pointer transition-colors ${
                  selectedStationary === stationary.id
                    ? "border-primary"
                    : "hover:border-primary/50"
                }`}
                onClick={() => handleStationarySelect(stationary.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{stationary.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Rating: {stationary.rating} • {stationary.distance}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {stationary.pricing}
                    </p>
                  </div>
                  <Store className="h-5 w-5 text-muted-foreground" />
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}