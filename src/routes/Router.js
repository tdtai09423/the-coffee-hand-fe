import { lazy } from "react";
import { Navigate } from "react-router-dom";

/****Layouts*****/
const FullLayout = lazy(() => import("../layouts/FullLayout.js"));

/***** Pages ****/
const Starter = lazy(() => import("../views/Starter.js"));
const Orders = lazy(() => import("../views/ui/Orders"));
const Payments = lazy(() => import("../views/ui/Payments"));
const Drinks = lazy(() => import("../views/ui/Drinks"));
const Ingredients = lazy(() => import("../views/ui/Ingredients"));
const Recipes = lazy(() => import("../views/ui/Recipes"));
const Users = lazy(() => import("../views/ui/Users"));
const Reports = lazy(() => import("../views/ui/Reports"));
const Settings = lazy(() => import("../views/ui/Settings"));
const Test = lazy(() => import("../views/ui/Sample/Tables"));
const Login = lazy(() => import("../views/ui/login"));

/*****Routes******/
const ThemeRoutes = [
  { path: "/login", exact: true, element: <Login /> },

  {
    path: "/",
    element: <FullLayout />,
    children: [
      { path: "/", element: <Navigate to="/starter" /> },
      { path: "/starter", exact: true, element: <Starter /> },
      { path: "/orders", exact: true, element: <Orders /> },
      { path: "/payments", exact: true, element: <Payments /> },
      { path: "/drinks", exact: true, element: <Drinks /> },
      { path: "/ingredients", exact: true, element: <Ingredients /> },
      { path: "/recipes", exact: true, element: <Recipes /> },
      { path: "/users", exact: true, element: <Users /> },
      { path: "/reports", exact: true, element: <Reports /> },
      { path: "/settings", exact: true, element: <Settings /> },     
    ],
  },
];

export default ThemeRoutes;
