import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Error404 from "./pages/404";
import LoanApplication from "./pages/LoanApplication";
import LoanVisualization from "./pages/LoanVisualization";
import LoanSimulator from "./pages/LoanSimulator";
import Login from "./pages/Login";
import SignIn from "./pages/AccountCreation";
import "./style/App.css";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/loan_application" element={<LoanApplication />} />
          <Route path="/loan_visualization" element={<LoanVisualization />} />
          <Route path="/loan_simulator" element={<LoanSimulator />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
