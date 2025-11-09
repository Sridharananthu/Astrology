
// export default App;
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import UserRoutes from "./routes/userRoutes.jsx";
import PanditRoutes from "./routes/panditRoutes.jsx";
import AdminRoutes from "./routes/adminRoutes.jsx";



function App() {
  return (
    <Router>
      <>
        <UserRoutes />
        <PanditRoutes />
        <AdminRoutes />

      </>
    </Router>
  );
}

export default App;
