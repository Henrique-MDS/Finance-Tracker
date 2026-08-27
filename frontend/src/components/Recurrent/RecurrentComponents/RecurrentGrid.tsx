import { Dessert, Dot } from "lucide-react";


export function RecurrentGrid() {

  return (
    <div>
        <div className="grid grid-cols-6 items-center text-white">
            <div className="flex gap-2 items-center">
                <div className="bg-green-padrao p-2 rounded-full">
                    <Dessert />
                </div>
                <div>
                    <p>Spotify</p>
                    <p>Assinatura</p>
                </div>
            </div>
            <div className="flex items-center gap-1">
                <Dot size={40}/>
                <p>Entretenimento</p>
            </div>
            <div>
                <p>R$ 3283</p>
            </div>
            <div>
                <p>Mensal</p>
            </div>
            <div>
                <p>10/06/2026</p>
            </div>
            <div>
                <p className="bg-green-padrao-25 w-fit px-3 rounded-sm">Ativa</p>
            </div>
        </div>
    </div>
  );
}

export default RecurrentGrid;