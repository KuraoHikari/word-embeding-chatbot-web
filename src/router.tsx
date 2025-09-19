import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
// import Login from "./pages/auth/Login";
// import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
// import Projects from "./pages/Projects";
// import Users from "./pages/Users";
// import Calendar from "./pages/Calendar";
// import Search from "./pages/Search";
// import Settings from "./pages/Settings";
// import NotFound from "./pages/NotFound";

import AuthGuard from "./components/common/AuthGuard";
import AuthPage from "./pages/auth/AuthPage";

export const router = createBrowserRouter([
 // Auth routes (without sidebar layout)
 {
  path: "/login",
  element: (
   <AuthGuard requireAuth={false}>
    <AuthPage mode="login" />
   </AuthGuard>
  ),
 },
 {
  path: "/register",
  element: (
   <AuthGuard requireAuth={false}>
    <AuthPage mode="register" />
   </AuthGuard>
  ),
 },

 // Main app routes (with sidebar layout)
 {
  path: "/",
  element: (
   <AuthGuard>
    <Layout />
   </AuthGuard>
  ),
  //   errorElement: <NotFound />,
  children: [
   {
    index: true,
    element: <Home />,
   },
   {
    path: "dashboard",
    element: <Dashboard />,
   },
   // Add more protected routes here
  ],
 },
]);
