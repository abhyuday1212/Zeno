import React from "react";
import { PhoneOff, User } from "lucide-react";
import { useAppSelector } from "@/lib/store/hooks";

const CallPopup = ({ name, email, onEndCall }) => {
  const isCallEnded = useAppSelector((state) => state.callContext.isCallEnded);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-white via-white to-gray-50 rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl border border-gray-100 animate-scale-in">
        <div className="text-center">
          {/* Profile Avatar with gradient border */}
          <div className="relative w-28 h-28 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse"></div>
            <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <User size={40} className="text-gray-600" />
              </div>
            </div>
          </div>
          {/* Contact Name with gradient text */}
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3">
            {name}
          </h2>
          {/* Call Status with animation */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
            <p className="text-gray-600 ml-3 text-lg">Calling...</p>
          </div>
          {/* Call Duration with modern styling */}
          <div className="bg-gray-50 rounded-full px-4 py-2 text-sm text-gray-500 mb-8 inline-block border">
            {email}
          </div>
          {/* Conditional render on hanging up the call */}
          {isCallEnded ? (
            <div className="m-2 text-rose-500 text-center">Call Ended</div>
          ) : null}
          {/* TODO : Add a button to go back to home page and vie the friend list */}
          {/* TODO : Add a Rate Experience component here */}
          {/* End Call Button with enhanced styling */}
          <button
            onClick={onEndCall}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-5 rounded-full shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl flex items-center justify-center mx-auto group"
          >
            <PhoneOff
              size={28}
              className="group-hover:rotate-12 transition-transform duration-300"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallPopup;
