import { useLanguage } from "@/i18n/LanguageContext";
import { getDateLocale } from "@/i18n/i18n";
import { Separator } from "@/components/ui/separator"
import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Database, Download, Eye, File, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import ReportTypeCard from "./ReportTypeCard"
import ReportPreviewPage from "./ReportOptions/ReportPreview"
import { toISODate } from "@/Utils/formatDate"
import { notify } from "@/Utils/notify"
import { useReactToPrint } from "react-to-print"
import CashFlowReport from "./ReportOptions/CashFlow"

export function ReportPage(){

    const { t } = useLanguage();
    const [firstDate, setFirstDate] = React.useState<Date>();
    const [secondDate, setSecondDate] = React.useState<Date>();
    const reportRef = React.useRef<HTMLDivElement>(null);
    const [reportModel, setReportModel] = React.useState("");
    const handlePrint = useReactToPrint({
        contentRef: reportRef,
        documentTitle: t("reports.docTitle"),
    });

    React.useEffect(() => {
        if (firstDate && secondDate && secondDate < firstDate) {
            notify.error(t("reports.dateOrder"));

            setFirstDate(undefined);
            setSecondDate(undefined);
        }
    }, [firstDate, secondDate]);

  return (
    <div className="overflow-x-hidden">
        <div className="pb-5">
            <h1 className="text-2xl text-foreground pb-1">{t("reports.title")}</h1>
            <p>{t("reports.subtitle")}</p>
        </div>
        <div className="px-3 flex items-center gap-5 cursor-pointer">
            <p className="pb-2">{t("reports.generate")}</p>
            <p className="pb-2">{t("reports.generated")}</p>
        </div>
        <Separator />
        <div className="pt-5 flex gap-5 flex-wrap lg:flex-nowrap">
            <div className="text-foreground flex flex-col gap-5 w-full">
                <div className="bg-dark-padrao p-7 rounded-xl flex flex-col gap-5 flex-1">
                    <div className="flex items-center gap-3">
                        <CalendarIcon />
                        <p>{t("reports.step1")}</p>
                    </div>
                    <div className="flex items-center gap-5 flex-wrap lg:flex-nowrap">
                        <div>
                            <p>{t("common.initialDate")}</p>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                    variant="outline"
                                    data-empty={!firstDate}
                                    className="w-[280px] justify-start text-left p-6 font-normal data-[empty=true]:text-muted-foreground bg-subdiv2-padrao"
                                    >
                                    <CalendarIcon />
                                    {firstDate ? format(firstDate, "PPP", { locale: getDateLocale() }) : <span>{t("common.selectDate")}</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={firstDate} onSelect={setFirstDate}/>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div>
                            <p>{t("common.finalDate")}</p>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                    variant="outline"
                                    data-empty={!secondDate}
                                    className="w-[280px] justify-start text-left p-6 font-normal data-[empty=true]:text-muted-foreground bg-subdiv2-padrao"
                                    >
                                    <CalendarIcon />
                                    {secondDate ? format(secondDate, "PPP", { locale: getDateLocale() }) : <span>{t("common.selectDate")}</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={secondDate} onSelect={setSecondDate}/>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </div>
                <div className="bg-dark-padrao p-7 rounded-xl flex flex-col gap-5 flex-1">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <Database />
                            <h2>{t("reports.step2")}</h2> 
                        </div>
                        <p className="text-text-padrao">{t("reports.step2Desc")}</p>
                        <div className="flex flex-wrap items-center gap-3">
                            <ReportTypeCard
                                title={t("reports.summary")}
                                desc={t("reports.summaryDesc")}
                                isSelected={reportModel === "resumo-financeiro"}
                                onSelect={() => setReportModel("resumo-financeiro")}
                            />
                            <ReportTypeCard
                                title={t("reports.cashFlow")}
                                desc={t("reports.cashFlowDesc")}
                                isSelected={reportModel === "fluxo-de-caixa"}
                                onSelect={() => setReportModel("fluxo-de-caixa")}
                            />
                        </div>            
                    </div>
                </div>
                <div className="bg-dark-padrao p-7 rounded-xl flex flex-col gap-5 flex-1">
                    <div className="flex items-center gap-3">
                        <File />
                        <h2>{t("reports.step3")}</h2>
                    </div>
                    <div>
                        <div className="flex items-center gap-3 w-[250px] flex gap-5 border-2 border-green-padrao rounded-sm p-3 cursor-pointer bg-green-500/10">
                            <FileText size={40}/>
                            <div>
                                <span>PDF</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <Button className="bg-green-padrao cursor-pointer hover:bg-[#109963] p-7" onClick={handlePrint}>
                            <Download />
                            {t("reports.generate")}
                        </Button>
                    </div>
                </div>
            </div>
            <div className="text-foreground bg-dark-padrao p-7 rounded-xl w-full">
                <div className="flex flex-col gap-5">
                    <div className="flex items-center gap-3">
                        <Eye />
                        <p>{t("reports.preview")}</p>
                    </div>
                    <div>
                        {(() => {
                            if(firstDate && secondDate && reportModel === "resumo-financeiro"){
                                return (
                                    <div
                                        ref={reportRef}
                                        className="overflow-y-auto scrollbar-hide max-h-screen print:max-h-none print:overflow-visible"
                                    >
                                        <ReportPreviewPage
                                            iniDate={toISODate(firstDate)}
                                            finalDate={toISODate(secondDate)}
                                        />
                                    </div>
                                );
                            } else if (firstDate && secondDate && reportModel === "fluxo-de-caixa") {
                                return (
                                    <div
                                        ref={reportRef}
                                        className="overflow-y-auto scrollbar-hide max-h-screen print:max-h-none print:overflow-visible"
                                    >
                                        <CashFlowReport
                                            iniDate={toISODate(firstDate)}
                                            finalDate={toISODate(secondDate)}
                                        />
                                    </div>
                                );
                            }

                            return (
                                <p className="text-muted-foreground">
                                    {t("reports.previewEmpty")}
                                </p>
                            );
                        })()}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default ReportPage;