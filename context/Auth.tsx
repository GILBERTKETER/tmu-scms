import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import App from "@/app/(site)/api/api";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  admission: string;
  profile_image: string;
  cover_image:string;
  role:string
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await App.get<{ user: User | null }>(
          "/api/auth/get-user/",
          { withCredentials: true },
        );
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);
  const login = async (email: string, password: string) => {
    try {
      const response = await App.post<{ message: string; user: User }>(
        "/api/auth/signin/",
        { email, password },
        { withCredentials: true },
      );
      setUser(response.data.user);
      if (response.data.logged) {
        toast.success(response.data.message);
        return true;
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Login failed");
      } else {
        toast.error("An unexpected error occurred");
      }
      return false;
    }
  };

  const logout = async () => {
    try {
      await App.post("/api/auth/signout/", {}, { withCredentials: true });
      setUser(null);
      toast.success("Logged out successfully");
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    }
  };

  return { user, loading, login, logout };
};
