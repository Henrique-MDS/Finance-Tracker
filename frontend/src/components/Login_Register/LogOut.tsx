// hooks/useLogout.ts
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useLogout() {
  const navigate = useNavigate();
  
  const logout = () => {
    toast.dismiss();
    toast.success("Finalizando sessão", {
      duration: 1500,
      position: "top-center",
    });
    localStorage.removeItem("userId");
    navigate("/login");
  };
  
  return logout;
}