// Static stub for the public (frontend-only) site.
// The real implementation calls the tRPC backend; on the standalone
// public website there is no backend, so we return a logged-out state.
export function useAuth(_options?: {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
}) {
  return {
    user: null as unknown,
    loading: false,
    error: null as unknown,
    isAuthenticated: false,
    refresh: () => Promise.resolve(),
    logout: () => Promise.resolve(),
  };
}
