import { formatDate } from "@/Utils/formatDate";
import trash from "../../assets/trash-icon.svg";
import { Button } from "../ui/button";
import { Separator } from "@/components/ui/separator"
import { deleteData } from "@/Utils/deleteData";
import { notify } from "@/Utils/notify";
import type { Category } from "@/types/generalTypes";

type CategorieGridProps = {
  categories: Category;
  refreshCategories: () => Promise<void>;
};

export function CategorieGrid({categories, refreshCategories}:CategorieGridProps) {

    const deleteCategory = async () => {
        const response = await deleteData(
            "Categories",
            {id: categories.id},
            "Deletar categoria específica"
        );

        if(response.success){
            notify.success("Categoria removida");
            await refreshCategories();
        } else {
            if(response.error.code == "23503"){
                notify.error("Existem transações com essa categoria");
            } else {
                notify.error("Erro ao remover categoria");
            }            
        }
    }

  return (
    <div>
        <Separator className="bg-gray-700"/>
        <div className="grid grid-cols-[1fr_1fr_80px] gap-4 items-center py-2">
            <p>{categories.name}</p>
            <p>{formatDate(categories.created_at)}</p>

            <Button 
                className="cursor-pointer bg-transparent hover:bg-transparent" onClick={() => deleteCategory()}
                style={categories.system ? { display: "none" } : { display: "block" }}
            >
                <img src={trash} alt="trash icon" className="w-[30px]" />
            </Button>
        </div>
    </div>    
  );
}

export default CategorieGrid;