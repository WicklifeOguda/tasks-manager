import { useQuery } from "@apollo/client";
import { CURRENT_USER } from "@/lib/graphql/auth";

// Authentication for restricted pages: getting logged in user
export function useAuth() {
    const { data, loading } = useQuery(CURRENT_USER, {
      fetchPolicy: "network-only", // Always fetch fresh user data
    });
  
    return { user: data?.loggedInUser, loading };
  }
  