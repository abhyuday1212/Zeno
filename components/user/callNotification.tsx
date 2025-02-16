"use client";

import { useAppSelector } from "@/lib/store/hooks";
import { toast } from "sonner";
import { useEffect, useRef } from "react";

const CallNotification = () => {
  const onGoingCall = useAppSelector((state) => state.callContext.ongoingCall);
  const toastIdRef = useRef<string | number | null>(null);

  useEffect(() => {
    if (onGoingCall.isRinging && !toastIdRef.current) {
      toastIdRef.current = toast.custom(
        (t) => (
          <div className="flex flex-col gap-1 px-3 py-2 border border-grey rounded-2xl w-[24rem]">
            <h2 className="text-lg font-semibold">Incoming Call</h2>
            <p className="text-lg">
              {onGoingCall.participants?.caller?.profile?.name || "Someone"} is
              calling...
            </p>
            <i className="text-muted-text text-xs">
              {onGoingCall.participants?.caller?.profile?.email || "Someone"}
            </i>
            <div className="flex gap-2 mt-1 justify-end">
              <button
                onClick={() => {
                  // Handle reject call
                  toast.dismiss(t);
                  toastIdRef.current = null;
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-md"
              >
                Reject
              </button>
              <button
                onClick={() => {
                  toast.dismiss(t);
                  toastIdRef.current = null;
                }}
                className="px-4 py-2 text-shine-lime rounded-md border border-green-1000"
              >
                Accept
              </button>
            </div>
          </div>
        ),
        {
          position: "bottom-right", // Add position here
        }
      );
    }

    return () => {
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
        toastIdRef.current = null;
      }
    };
  }, [onGoingCall.isRinging, onGoingCall.participants]);

  return null;
};

export default CallNotification;
