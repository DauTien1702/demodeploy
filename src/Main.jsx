import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import App from "./App.jsx";
import "./utils/index.css";
import CustomCloseButton from "./utils/customCloseBtn.jsx";
import "primereact/resources/themes/lara-light-blue/theme.css"; // hoặc theme khác
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { store } from "./state/store.js";
import { Provider } from "react-redux";

// Render
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />

      {/* Toast msg */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        closeButton={<CustomCloseButton />}
      />
    </Provider>
  </StrictMode>
);
