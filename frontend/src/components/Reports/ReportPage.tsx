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
import ReportPreviewPage from "./ReportPreview"

export function ReportPage(){

    const [firsDate, setFirsDate] = React.useState<Date>();
    const [secondDate, setSecondDate] = React.useState<Date>();

  return (
    <div>
        <div className="pb-5">
            <h1 className="text-2xl text-white pb-1">Relatórios</h1>
            <p>Gere relatórios detalhados para suas finanças</p>
        </div>
        <div className="px-3 flex items-center gap-5 cursor-pointer">
            <p className="pb-2">Gerar Relatório</p>
            <p className="pb-2">Relatórios Gerados</p>
        </div>
        <Separator />
        <div className="pt-5 flex gap-5">
            <div className="text-white flex flex-col gap-5">
                <div className="bg-[#0B1723] p-7 rounded-xl flex flex-col gap-5">
                    <div className="flex items-center gap-3">
                        <CalendarIcon />
                        <p>1. Selecionar Período</p>
                    </div>
                    <div className="flex items-center gap-5">
                        <div>
                            <p>Data Inicial</p>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                    variant="outline"
                                    data-empty={!firsDate}
                                    className="w-[280px] justify-start text-left p-6 font-normal data-[empty=true]:text-muted-foreground bg-[#0B1723]"
                                    >
                                    <CalendarIcon />
                                    {firsDate ? format(firsDate, "PPP") : <span>Selecione uma data</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={firsDate} onSelect={setFirsDate}/>
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
                <div className="bg-[#0B1723] p-7 rounded-xl flex flex-col gap-5">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <Database />
                            <h2>2. Selecionar Dados</h2> 
                        </div>
                        <p className="text-[#778294]">Escolha quais informações deseja incluir no relatório</p>
                        <div className="flex items-center gap-3">
                            <ReportTypeCard />
                        </div>            
                    </div>
                </div>
                <div className="bg-[#0B1723] p-7 rounded-xl flex flex-col gap-5">
                    <div className="flex items-center gap-3">
                        <File />
                        <h2>3. Selecionar Formato</h2>
                    </div>
                    <div>
                        <div className="flex gap-3 w-[250px] flex gap-5 border-2 border-emerald-700 rounded-sm p-3 cursor-pointer bg-green-500/10">
                            <FileText size={40}/>
                            <div>
                                <span>PDF</span>
                                <p className="text-[#778294]">Recomendado para impressão</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <Button className="bg-[#108163] cursor-pointer hover:bg-[#109963] p-7">
                            <Download />
                            Gerar Relatório
                        </Button>
                    </div>
                </div>
            </div>
            <div className="text-white bg-[#0B1723] p-7 rounded-xl w-full">
                <div className="flex flex-col gap-5">
                    <div className="flex items-center gap-3">
                        <Eye />
                        <p>Prévia do relatório</p>
                    </div>
                    <div>
                        <ReportPreviewPage />
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default ReportPage;