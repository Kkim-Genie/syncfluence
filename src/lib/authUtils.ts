import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "./store";

/**
 * Hook to check authentication status and redirect if necessary
 * @param requiredRole Optional role to check (will redirect if user doesn't have this role)
 * @param redirectTo Path to redirect to if not authenticated (defaults to /login)
 */
export function useAuthCheck(
  requiredRole?: "brand" | "influencer",
  redirectTo: string = "/login"
) {
  const { hydrate } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Hydrate auth state from localStorage
    hydrate();

    const user = useAuthStore.getState().user;

    if (!user) {
      // Not authenticated, redirect to login
      router.push(redirectTo);
    } else if (requiredRole && user.role !== requiredRole) {
      // Wrong role, redirect to appropriate dashboard
      if (user.role === "brand") {
        router.push("/brand/dashboard");
      } else {
        router.push("/influencer/dashboard");
      }
    }
  }, [hydrate, router, requiredRole, redirectTo]);

  // Return current user for convenience
  return useAuthStore((state) => state.user);
}
