import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean; // If true, requires authentication, if false, requires no authentication (for login/register pages)
}

export default function AuthGuard({
  children,
  requireAuth = true,
}: AuthGuardProps) {
  const { isAuthenticated, token, logout } = useAuthStore();

  const [isChecking, setIsChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      if (token && isAuthenticated) {
        try {
          // Check if token is expired
          const payload = await JSON.parse(atob(token.split(".")[1]));

          const isExpired = payload.exp * 1000 < Date.now();

          if (isExpired) {
            logout();
          }
        } catch {
          logout();
        }
      }
      setIsChecking(false);
    };

    checkAuth();
  }, [token, isAuthenticated, logout]);

  if (isChecking) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Checking authentication...</span>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!requireAuth && isAuthenticated) {
    // Redirect to home page if trying to access auth pages while authenticated
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
