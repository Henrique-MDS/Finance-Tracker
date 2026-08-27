import { Button } from "../ui/button";
import RecurrentCard from "./RecurrentCard/RecurrentCard";
import { ArrowDownIcon, ChevronDown, ListFilter } from "lucide-react";
import RecurrentGrid from "./RecurrentComponents/RecurrentGrid";

export function RecurrentPage() {


  return (
    <div className="flex flex-col gap-5">
        <div>
            <h1 className="text-2xl text-white">Transações Recorrentes</h1>
            <p>Gerencie suas despesas e receitas que repetem automaticamente</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap lg:flex-nowrap w-full">
            <RecurrentCard
                title="Receitas Recorrentes" 
                desc="R$ 3283" 
                info="2 Recorrencias"
                color="bg-green-padrao"
                icon={ArrowDownIcon}
            />
            <RecurrentCard
                title="Receitas Recorrentes" 
                desc="R$ 3283" 
                info="2 Recorrencias"
                color="bg-green-padrao"
                icon={ArrowDownIcon}
            />
            <RecurrentCard
                title="Receitas Recorrentes" 
                desc="R$ 3283" 
                info="2 Recorrencias"
                color="bg-green-padrao"
                icon={ArrowDownIcon}
            />
            <RecurrentCard
                title="Receitas Recorrentes" 
                desc="R$ 3283" 
                info="2 Recorrencias"
                color="bg-green-padrao"
                icon={ArrowDownIcon}
            />
        </div>
        <div className="flex gap-5">
            <div className="w-[70%] flex flex-col gap-5 p-3 rounded-xl" style={{border: "1px solid #111820"}}>
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Suas transações recentes</h2>
                    <div className="flex gap-3">
                        <Button className="p-5 bg-transparent cursor-pointer" style={{border: "1px solid #111820"}}>
                            Todos Status
                            <ChevronDown />
                        </Button>
                        <Button className="p-5 bg-transparent cursor-pointer" style={{border: "1px solid #111820"}}>
                            Filtros
                            <ListFilter />
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-6 bg-subdiv-padrao p-3 rounded-sm">
                        <p>Descrição</p>
                        <p>Categoria</p>
                        <p>Valor</p>
                        <p>Frequência</p>
                        <p>Próxima execução</p>
                        <p>Status</p>
                    </div>
                    <div className="flex flex-col gap-3">
                        <RecurrentGrid />
                        <RecurrentGrid />
                        <RecurrentGrid />
                    </div>
                </div>
            </div>
            <div className="w-[30%]">
                <div>
                    <h2 className="text-xl font-bold text-white">Nova transação recente</h2>
                </div>
            </div>
        </div>
    </div>
  );
}

export default RecurrentPage;