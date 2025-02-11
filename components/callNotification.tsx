"use client";

import { useAppSelector } from "@/lib/store/hooks";

const CallNotification = () => {
  console.log("CallNotification called...1");

  const onGoingCall = useAppSelector((state) => state.callContext.ongoingCall);

  console.log("CallNotification called...2");
  console.log("On Going call",onGoingCall);
  
  if (!onGoingCall.isRinging) return;
  console.log("CallNotification called...3");

  return (
    <div className="relative">
      <div className="bg-slate-500 w-screen h-screen top-0 bottom-0 flex items-center justify-center">
        Someone is calling
      </div>
    </div>
  );
};

export default CallNotification;
