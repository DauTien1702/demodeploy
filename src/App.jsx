import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./MainLayout";

function App() {
  // Connect to all routers
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<MainLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
