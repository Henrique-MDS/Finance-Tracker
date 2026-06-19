import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    toast.dismiss();
    toast.error("Inicie uma sessão!", {
        duration: 1500,
        position: "top-center",
    });
    return <Navigate to="/login" replace />;
  }

  return children;
}