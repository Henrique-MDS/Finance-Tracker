import { computeNextExecution } from "@/Utils/nextExecution";
import { useLanguage } from "@/i18n/LanguageContext";
import { translateCategory, translateFrequency, translateType } from "@/i18n/i18n";
import type { RecurrentTable } from "@/types/generalTypes";
import { useAuth } from "@/Utils/AuthContext";
import { formatDate } from "@/Utils/formatDate";
import { formatCurrencyBR } from "@/Utils/formateToBr";
import { getData } from "@/Utils/getData";
import { deleteData } from "@/Utils/deleteData";
import { notify } from "@/Utils/notify";
import { defaultIcons } from "@/Utils/icons";
import { supabase } from "@/services/supabase";
import { ArrowDownIcon, ArrowUpIcon, Dot, EllipsisVertical, Trash, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type RecurrentGridProps = {
    recurrentData: RecurrentTable;
    onRefresh: () => Promise<void>;
    onRefreshRecurrentResume: () => Promise<void>;
};

export function RecurrentGrid({ recurrentData, onRefresh, onRefreshRecurrentResume }:RecurrentGridProps) {

    const { user, loading } = useAuth();
    const { t } = useLanguage();
    const [catName, setCatName] = useState("");
    const [catIcon, setCatIcon] = useState("");

    const getCategoryName = async () => {
        if (!user) return;
        const response = await getData("Categories", {user_id: user.id, id: recurrentData.category_id}, "buscar nome categoria");

        if(response.success){
            if(response.data && response.data.length > 0){
                setCatName(translateCategory(response.data[0].name));
                setCatIcon(response.data[0].icon);
            } else {
                setCatName(t("categories.notFound"));
            }
        } else {
            notify.error(t("common.fetchCategoryError"));
            return;
        }
    }

    useEffect(() => {
        getCategoryName();
    }, [user?.id])

    if (loading) {
        return <div>{t("common.loading")}</div>;
    }

    if (!user) {
        return <Navigate to="/Login" replace />;
    }

    const icon = defaultIcons.find((item) => item.name === catIcon) ?? defaultIcons[9];
    const Icon = icon.icon;

    const deleteRecurrent = async () => {
        const response = await deleteData(
            "Recurrent",
            { id: recurrentData.id },
            "Excluir transação recorrente"
        );

        if(response.success){
            notify.success(t("recurrent.deleted"));
            await onRefresh();
            await onRefreshRecurrentResume();
        } else {
            notify.error(t("recurrent.deleteError"));
        }
    }

    const toggleStatus = async () => {
        const activating = !recurrentData.active;
        const changes = activating
            ? { active: true, next_execution: computeNextExecution(recurrentData).toISOString() }
            : { active: false };

        const { error } = await supabase
            .from("Recurrent")
            .update(changes)
            .eq("id", recurrentData.id);

        if(error){
            notify.error(t("recurrent.statusError"));
            return;
        }

        notify.success(recurrentData.active ? t("recurrent.deactivated") : t("recurrent.activated"));
        await onRefresh();
        await onRefreshRecurrentResume();
    }

    const typeBadge = (
        <span title={translateType(recurrentData.type)}>
            {recurrentData.type === "Receita"
                ? <ArrowUpIcon size={14} color="#2CAE60" className="shrink-0"/>
                : <ArrowDownIcon size={14} color="#EF4444" className="shrink-0"/>}
        </span>
    );

    const statusBadge = (
        <p className={`${recurrentData.active ? "bg-green-padrao-25 w-fit px-3 rounded-sm truncate max-w-full" : "bg-red-padrao-25 w-fit px-3 rounded-sm truncate max-w-full"}`}>
            {recurrentData.active ? t("recurrent.statusActive") : t("recurrent.statusInactive")}
        </p>
    );

    const actionsMenu = (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="cursor-pointer bg-transparent hover:bg-transparent shrink-0">
                    <EllipsisVertical />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => toggleStatus()}>
                    <RefreshCw />
                    {recurrentData.active ? t("recurrent.deactivate") : t("recurrent.activate")}
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onClick={() => deleteRecurrent()}>
                    <Trash />
                    {t("common.delete")}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );

  return (
    <div>
        <div className="hidden md:grid gap-2 items-center grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.3fr)_minmax(0,1fr)_44px] text-foreground">
            <div className="flex gap-2 items-center min-w-0">
                <div className="p-2 rounded-full shrink-0" style={{backgroundColor: icon.color}}>
                    <Icon className="text-white"/>
                </div>
                <p className="truncate" title={recurrentData.desc}>{recurrentData.desc}</p>
            </div>
            <div className="flex items-center gap-1 min-w-0">
                <Dot size={40} className="shrink-0"/>
                <p className="truncate">{catName}</p>
            </div>
            <div className="min-w-0 flex items-center gap-1">
                {typeBadge}
                <p className="truncate">{formatCurrencyBR(recurrentData.value)}</p>
            </div>
            <div className="min-w-0">
                <p className="truncate">{translateFrequency(recurrentData.frequency)}</p>
            </div>
            <div className="min-w-0">
                <p className="truncate">{formatDate(recurrentData.next_execution)}</p>
            </div>
            <div className="min-w-0">
                {statusBadge}
            </div>
            <div className="flex justify-end">
                {actionsMenu}
            </div>
        </div>

        <div className="md:hidden flex flex-col gap-3 bg-subdiv-padrao p-3 rounded-xl text-foreground">
            <div className="flex items-start justify-between gap-2">
                <div className="flex gap-2 items-center min-w-0">
                    <div className="p-2 rounded-full shrink-0" style={{backgroundColor: icon.color}}>
                        <Icon className="text-white"/>
                    </div>
                    <div className="min-w-0">
                        <p className="wrap-break-word">{recurrentData.desc}</p>
                        <p className="text-sm text-text-padrao truncate">{catName}</p>
                    </div>
                </div>
                {actionsMenu}
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="min-w-0">
                    <p className="text-text-padrao">{t("common.value")}</p>
                    <p className="truncate flex items-center gap-1">
                        {typeBadge}
                        {formatCurrencyBR(recurrentData.value)}
                    </p>
                </div>
                <div className="min-w-0">
                    <p className="text-text-padrao">{t("common.frequency")}</p>
                    <p className="truncate">{translateFrequency(recurrentData.frequency)}</p>
                </div>
                <div className="min-w-0">
                    <p className="text-text-padrao">{t("recurrent.nextExecution")}</p>
                    <p className="truncate">{formatDate(recurrentData.next_execution)}</p>
                </div>
                <div className="min-w-0">
                    <p className="text-text-padrao">{t("common.status")}</p>
                    {statusBadge}
                </div>
            </div>
        </div>
    </div>
  );
}

export default RecurrentGrid;