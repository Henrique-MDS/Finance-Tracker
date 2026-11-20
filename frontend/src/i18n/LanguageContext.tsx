import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/services/supabase";
import { useAuth } from "@/Utils/AuthContext";
import { notify } from "@/Utils/notify";
import { getLanguage, isLanguage, setCurrentLanguage, translate, type Language } from "./i18n";

type LanguageContextType = {
    language: Language;
    setLanguage: (language: Language) => Promise<void>;
    t: typeof translate;
};

const LanguageContext = createContext<LanguageContextType>({
    language: getLanguage(),
    setLanguage: async () => {},
    t: translate,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [language, setLanguageState] = useState<Language>(getLanguage());

    const applyLanguage = (lang: Language) => {
        setCurrentLanguage(lang);
        setLanguageState(lang);
    };

    useEffect(() => {
        if (!user) return;

        const loadUserLanguage = async () => {
            const { data, error } = await supabase
                .from("Params")
                .select("LANGUAGE")
                .eq("user_id", user.id)
                .maybeSingle();

            if (!error && isLanguage(data?.LANGUAGE)) {
                applyLanguage(data.LANGUAGE);
            }
        };

        loadUserLanguage();
    }, [user?.id]);

    const setLanguage = async (lang: Language) => {
        applyLanguage(lang);
        if (!user) return;

        const { error } = await supabase.from("Params").update({ LANGUAGE: lang }).eq("user_id", user.id);
        if (error) {
            notify.error(translate("settings.paramsUpdateError"));
        }
    };

    const t = useCallback<typeof translate>((key, params) => translate(key, params), [language]);

    const value = useMemo(() => ({ language, setLanguage, t }), [language, user?.id]);

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
    return useContext(LanguageContext);
}
