import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axiosInstance from "../../services/api/api";
import { setCredentials, logout } from "../../store/slices/authSlice";

const useAuthInit = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const loadUser = async () => {
      try {
        const resp = await axiosInstance.get("/auth/me"); // backend must return user info
        const user = resp.data;
        console.log("Loaded user:", user);
        const refreshToken = localStorage.getItem("refreshToken");

        dispatch(
          setCredentials({
            user,
            token,
            refreshToken: refreshToken || undefined,
          })
        );
      } catch (err) {
        console.error("Auth Init Error:", err);
        dispatch(logout());
      }
    };

    loadUser();
  }, []);
};

export default useAuthInit;
