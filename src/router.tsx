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
import ProtectedRoute from "./components/common/ProtectedRoute";

export const router = createBrowserRouter([
 // Auth routes (without sidebar layout)
 //  {
 //   path: "/login",
 //   element: <Login />,
 //  },
 //  {
 //   path: "/register",
 //   element: <Register />,
 //  },

 // Main app routes (with sidebar layout)
 {
  path: "/",
  element: (
   <ProtectedRoute>
    <Layout />
   </ProtectedRoute>
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
   //    {
   //     path: "projects",
   //     element: <Projects />,
   //    },
   //    {
   //     path: "users",
   //     element: <Users />,
   //    },
   //    {
   //     path: "calendar",
   //     element: <Calendar />,
   //    },
   //    {
   //     path: "search",
   //     element: <Search />,
   //    },
   //    {
   //     path: "settings",
   //     element: <Settings />,
   //    },
  ],
 },
]);
