import { FileText } from "lucide-react";
import NewGoalInput from "../Inputs/newGoalInput";


export function NewGoalModal() {

    return (
        <div className="">
            <div className="flex flex-col gap-5">
                <div className="flex items-center gap-2">
                    <FileText color="#2CAE60"/>
                    <h2 className="text-[16px]">Informações da Meta</h2>
                </div>
                <div>
                    <NewGoalInput title="Nome da Meta *" placeholder="Ex: Viagem para o Havaii" desc="Dê um nome inspirador a sua meta"/>
                    
                </div>
            </div>
        </div>
    );
}

export default NewGoalModal;