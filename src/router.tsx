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
import ChatbotList from "./pages/chatbot/ChatbotList";
import CreateChatbot from "./pages/chatbot/CreateChatbot";
import ChatbotCustomerPage from "./pages/ChatbotCustomerPage";

import EditChatbot from "./pages/chatbot/EditChatbot";
import ChatbotDetailsMock from "./pages/chatbot/ChatbotDetailsMock";
import CompareUpload from "./pages/compare/CompareUpload";
import CompareDashboard from "./pages/compare/CompareDashboard";
import ConversationsPage from "./pages/chatbot/ConversationsPage";

export const router = createBrowserRouter([
 // Auth routes (without sidebar layout)
 {
  path: "/chatbot-costumer/:chatbotId",
  element: <ChatbotCustomerPage />,
 },
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
 {
  path: "/chatbot",
  element: (
   <AuthGuard>
    <Layout />
   </AuthGuard>
  ),
  //   errorElement: <NotFound />,
  children: [
   {
    index: true,
    element: <ChatbotList />,
   },
   {
    path: "create",
    element: <CreateChatbot />,
   },
   {
    path: ":id",
    element: <ChatbotDetailsMock />,
   },
   {
    path: ":id/edit",
    element: <EditChatbot />,
   },
   {
    path: ":id/conversations",
    element: <ConversationsPage />,
   },
   {
    path: ":id/compare/upload",
    element: <CompareUpload />,
   },
   {
    path: ":id/compare/dashboard",
    element: <CompareDashboard />,
   },
  ],
 },
 // Standalone compare routes (without chatbot context)
 {
  path: "/compare",
  element: (
   <AuthGuard>
    <Layout />
   </AuthGuard>
  ),
  children: [
   {
    path: "upload",
    element: <CompareUpload />,
   },
   {
    path: "dashboard",
    element: <CompareDashboard />,
   },
  ],
 },
]);
