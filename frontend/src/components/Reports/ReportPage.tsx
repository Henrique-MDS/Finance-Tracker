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
import { formatDate } from "@/Utils/formatDate"
import { notify } from "@/Utils/notify"
import { useReactToPrint } from "react-to-print"
import CashFlowReport from "./ReportOptions/CashFlow"

export function ReportPage(){

    const [firstDate, setFirstDate] = React.useState<Date>();
    const [secondDate, setSecondDate] = React.useState<Date>();
    const reportRef = React.useRef<HTMLDivElement>(null);
    const [reportModel, setReportModel] = React.useState("");
    const handlePrint = useReactToPrint({
        contentRef: reportRef,
        documentTitle: "Relatório Financeiro",
    });

    React.useEffect(() => {
        if (firstDate && secondDate && secondDate < firstDate) {
            notify.error("A data final deve ser maior que a inicial");

            setFirstDate(undefined);
            setSecondDate(undefined);
        }
    }, [firstDate, secondDate]);

  return (
    <div className="overflow-x-hidden">
        <div className="pb-5">
            <h1 className="text-2xl text-white pb-1">Relatórios</h1>
            <p>Gere relatórios detalhados para suas finanças</p>
        </div>
        <div className="px-3 flex items-center gap-5 cursor-pointer">
            <p className="pb-2">Gerar Relatório</p>
            <p className="pb-2">Relatórios Gerados</p>
        </div>
        <Separator />
        <div className="pt-5 flex gap-5 flex-wrap lg:flex-nowrap">
            <div className="text-white flex flex-col gap-5 w-full">
                <div className="bg-dark-padrao p-7 rounded-xl flex flex-col gap-5 flex-1">
                    <div className="flex items-center gap-3">
                        <CalendarIcon />
                        <p>1. Selecionar Período</p>
                    </div>
                    <div className="flex items-center gap-5 flex-wrap lg:flex-nowrap">
                        <div>
                            <p>Data Inicial</p>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                    variant="outline"
                                    data-empty={!firstDate}
                                    className="w-[280px] justify-start text-left p-6 font-normal data-[empty=true]:text-muted-foreground bg-[#0B1723]"
                                    >
                                    <CalendarIcon />
                                    {firstDate ? format(firstDate, "PPP") : <span>Selecione uma data</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={firstDate} onSelect={setFirstDate}/>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div>
                            <p>Data Final</p>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                    variant="outline"
                                    data-empty={!secondDate}
                                    className="w-[280px] justify-start text-left p-6 font-normal data-[empty=true]:text-muted-foreground bg-[#0B1723]"
                                    >
                                    <CalendarIcon />
                                    {secondDate ? format(secondDate, "PPP") : <span>Selecione uma data</span>}
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
                            <h2>2. Selecionar Dados</h2> 
                        </div>
                        <p className="text-text-padrao">Escolha quais informações deseja incluir no relatório</p>
                        <div className="flex flex-wrap items-center gap-3">
                            <ReportTypeCard
                                title="Resumo Financeiro"
                                desc="Receitas, despesas, saldo e economia do período"
                                isSelected={reportModel === "resumo-financeiro"}
                                onSelect={() => setReportModel("resumo-financeiro")}
                            />
                            <ReportTypeCard
                                title="Fluxo de caixa"
                                desc="Entradas e saídas diárias do período selecionado"
                                isSelected={reportModel === "fluxo-de-caixa"}
                                onSelect={() => setReportModel("fluxo-de-caixa")}
                            />
                        </div>            
                    </div>
                </div>
                <div className="bg-dark-padrao p-7 rounded-xl flex flex-col gap-5 flex-1">
                    <div className="flex items-center gap-3">
                        <File />
                        <h2>3. Selecionar Formato</h2>
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
                            Gerar Relatório
                        </Button>
                    </div>
                </div>
            </div>
            <div className="text-white bg-dark-padrao p-7 rounded-xl w-full">
                <div className="flex flex-col gap-5">
                    <div className="flex items-center gap-3">
                        <Eye />
                        <p>Prévia do relatório</p>
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
                                            iniDate={formatDate(firstDate)}
                                            finalDate={formatDate(secondDate)}
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
                                            iniDate={formatDate(firstDate)}
                                            finalDate={formatDate(secondDate)}
                                        />
                                    </div>
                                );
                            }

                            return (
                                <p className="text-gray-400">
                                    Selecione um período para visualizar a prévia...
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