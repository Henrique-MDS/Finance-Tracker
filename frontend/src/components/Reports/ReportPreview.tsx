import { Separator } from "@/components/ui/separator"
import ReportResumeCard from "./ReportResumeCards";

export function ReportPreviewPage(){

  return (
    <div className="bg-white text-black text-[10px] rounded-xl p-4">
        <div className="flex items-center justify-between">
            <div className="w-[100px]">
                <img src="src/assets/logo-tracker.png" alt="finance-tracker-logo" />
            </div>
            <div>
                <h3 className="font-semibold">Relatório Financeiro</h3>
                <p>Período: 01/07/2026 a 31/07/2026</p>
                <p>Gerado em: 09/10/2026</p>
            </div>
        </div>
        <Separator  className="bg-gray-200"/>
        <div className="py-4">
            <h3 className="font-bold">Resumo do Período</h3>
            <div className="flex items-center gap-3">
                <ReportResumeCard title={"Receitas"} value={"R$ 5.000,00"} themeColor={"#009966"}/>
            </div>
        </div>
    </div>
  );
}

export default ReportPreviewPage;