import React from "react";
import "./App.css";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <div className="text-3xl text-teal-500 font-bold text-center mt-[100px]">
        react-starter-template
      </div>
      <Toaster position="top-center" />
    </>
  );
}

export default App;
