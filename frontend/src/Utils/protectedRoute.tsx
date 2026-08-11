import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { supabase } from "@/services/supabase";
import { useEffect, useState } from "react";

type Props = {
    children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {

    const { user, loading } = useAuth();

    const [checkingMFA, setCheckingMFA] = useState(true);
    const [requiresMFA, setRequiresMFA] = useState(false);

    useEffect(() => {

        const checkMFA = async () => {

            if (!user) {
                setCheckingMFA(false);
                return;
            }

            const { data, error } =
                await supabase.auth.mfa
                    .getAuthenticatorAssuranceLevel();

            if (error) {
                console.error(error);
                setCheckingMFA(false);
                return;
            }

            const needsMFA =
                data.currentLevel === "aal1" &&
                data.nextLevel === "aal2";

            setRequiresMFA(needsMFA);
            setCheckingMFA(false);
        };

        checkMFA();

    }, [user]);

    if (loading || checkingMFA) {
        return <div>Carregando...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (requiresMFA) {
        return <Navigate to="/mfa" replace />;
    }

    return children;
}