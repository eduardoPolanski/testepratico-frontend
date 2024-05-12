import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Siderbar";
import CustomerList from "./pages/CustomerList";
import RouterList from "./pages/RouterList";
import Home from "./pages/Home";

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/clientes" element={<CustomerList />} />
            <Route path="/roteadores" element={<RouterList />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
