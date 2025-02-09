"use client";

import { Button } from "./ui/button";
import { handleSignOut } from "@/app/actions/authActions";

export default function SignOut() {
  const handleUserSignOut = async () => {
    //clear all the stored Data
    await handleSignOut();
    // dispatch(clearAuthToken());
    // dispatch(clearChatHistory());
    // dispatch(clearChatId());
    // dispatch(clearArchitectureData());
    // dispatch(clearInputPrompt());
  };
  return (
    <Button variant="default" type="submit" onClick={handleUserSignOut}>
      Sign Out
    </Button>
  );
}
