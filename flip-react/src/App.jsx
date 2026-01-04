import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import FlipHome from "./pages/flip/FlipHome";
import FlipBookPage from "./pages/flip/FlipBookPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/flip" element={<FlipHome />} />
        <Route path="/flip/:id" element={<FlipBookPage />} />
      </Routes>
    </BrowserRouter>
  );
}
