// src/App.js
import React, { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import ThemeRoutes from "./routes/Router";

const AppRoutes = () => {
  const routing = useRoutes(ThemeRoutes);
  return routing;
};

const App = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppRoutes />
    </Suspense>
  );
};

export default App;
