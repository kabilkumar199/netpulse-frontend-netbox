import { useEffect } from "react";
import {axiosInstance} from "../../services/api/api";
import { useAuthStore } from "../../store/authStore";

const useAuthInit = () => {
  const { setCredentials, logout } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const loadUser = async () => {
      try {
        const resp = await axiosInstance.get("/auth/me"); // backend must return user info
        const user = resp.data;
        console.log("Loaded user:", user);
        const refreshToken = localStorage.getItem("refreshToken");

        setCredentials({
          user,
          token,
          refreshToken: refreshToken || undefined,
        });
      } catch (err) {
        console.error("Auth Init Error:", err);
        logout();
      }
    };

    loadUser();
  }, [setCredentials, logout]);
};

export default useAuthInit;
