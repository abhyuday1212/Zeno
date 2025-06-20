"use client";

import { useSearchParams } from "next/navigation";
import CustomErrorPage from "@/components/errors/CustomErrorPage1";
import CustomBackButton from "@/components/ui/customBackButton";
import HomeButton from "@/components/ui/homeButton";

const ErrorPage = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bgColor">
      <CustomErrorPage
        message={
          error
            ? `Uh Oh! We've got a problem in ${error}.`
            : "Uh Oh! We've got a problem."
        }
      />

      {/* Arrange the component that is holding the buttons just below the CustomErrorPage component */}
      <div className="flex justify-around gap-4 mt-2 w-[28rem] px-4">
        <CustomBackButton />
        <HomeButton />
      </div>
    </div>
  );
};

export default ErrorPage;
