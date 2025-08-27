import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { routes } from "./routes/Routes";
// import { Toaster } from "react-hot-toast";
// import { persistor, store } from "./redux/store.js";
// import { PersistGate } from "redux-persist/integration/react";
// import { Provider } from "react-redux";
const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    {/* <Provider store={store}> */}
    {/* <PersistGate loading={null} persistor={persistor}> */}
    {/* <Toaster position="top-center" toastOptions={{ duration: 1500 }} /> */}
    <RouterProvider router={routes} />
    {/* </PersistGate> */}
    {/* </Provider> */}
  </StrictMode>
);