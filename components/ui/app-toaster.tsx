"use client";

import { Toaster } from "react-hot-toast";

export function AppToaster() {
  return (
    <Toaster
      containerStyle={{
        top: 20,
        left: "50%",
        transform: "translateX(-50%)",
      }}
      toastOptions={{
        duration: 3000,
        removeDelay: 200,
      }}
      gutter={12}
      position="top-center"
      reverseOrder={false}
    />
  );
}
