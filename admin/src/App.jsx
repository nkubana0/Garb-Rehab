import React from "react";
import Navbar from "./components/navbar/navbar";
import Admin from "./pages/admin/admin";
import { AuthProvider } from "./context/AuthContext";

const App = () => {
  return (
    <div>
      <AuthProvider>
        <Navbar />
        <Admin />
      </AuthProvider>
    </div>
  );
};

export default App;
