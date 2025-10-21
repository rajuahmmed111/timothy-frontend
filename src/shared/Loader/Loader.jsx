import React from "react";
export default function Loader() {
  return (
    <div className="flex justify-center items-center h-[100vh]">
      <div className="w-10 h-10 animate-spin rounded-full border-dashed border-8 border-[#3b9df8]"></div>
    </div>
  );
}
