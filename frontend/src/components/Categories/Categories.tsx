import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "../ui/button";
import { Separator } from "@/components/ui/separator"
import CategorieGrid from "../Categorie_Grid/Categorie_Grid";
import { useEffect, useState } from "react";
import { getData } from "@/Utils/getData";
import { notify } from "@/Utils/notify";
import { insertData } from "@/Utils/insertData";
import { verifyForm } from "@/Utils/verifyForm";

type Category = {
  created_at: string;
  id: string;
  name: string;
  updated_at: string;
  user_id: string;
}

export function CategoriesPage() {

    const [cat, setCat] = useState<any>([]);
    const [catName, setCatName] = useState("");
    const userId = localStorage.getItem("userId");

    const getAllCategories = async () => {
        const categories = await getData(
            "Categories",
            {user_id: userId},
            "Buscar todas as categorias"
        );

        if(categories.success){
            setCat(categories.data ?? []);
        } else {
            notify.error("Erro ao buscar categorias");
            return;
        }
    }

    useEffect(() => {
        getAllCategories();
    }, [userId])
    
    const saveCategory = async () => {
        if(verifyForm([catName])){
            if(catName.length > 20){
                notify.error("Nome deve ter menos que 20 caracteres");
            }

            const saveResponse = await insertData(
                "Categories",
                {
                    user_id: userId,
                    name: catName
                },
                "Inserir categoria"
            );

            if(saveResponse.success){
                notify.success("Categoria Adicionada");
                getAllCategories();
            } else {
                if(saveResponse.error.code == "23505"){
                    notify.error("Categoria já existe");
                } else {
                    notify.error("Erro ao adicionar categoria");
                }                
            }
            setCatName("");
        }        
    }

  return (
    <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
            <h1 className="text-2xl text-white">Categorias</h1>
            <p>Gerencie suas categorias de receitas e despesas</p>
        </div>
        <div className="bg-[#111820] p-5 rounded-xl text-white flex flex-col gap-5">
            <h1 className="text-emerald-300 text-xl">Nova Categoria</h1>
            <div className="flex flex-col gap-2">
                <p>Nome da Categoria</p>
                <div className="flex items-center gap-2">
                    <Field>
                        <Input id="input-demo-api-key" type="text" placeholder="Nome da categoria..." onChange={(e) => setCatName(e.target.value)} value={catName}/>
                    </Field>
                    <Button className="bg-emerald-500 cursor-pointer" onClick={() => saveCategory()}>Salvar</Button>
                </div>                
            </div>
        </div> 
        <div className="bg-[#111820] p-5 rounded-xl text-white flex flex-col gap-5">
            <div className="flex items-center justify-between">
                <h2 className="text-emerald-300 text-xl">Suas Categorias</h2>
                <Field className="w-72">
                    <Input id="input-demo-api-key" type="text" placeholder="Nome da categoria..." />
                </Field>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-sm text-[#777E78]">
                <p>Nome</p>
                <p>Criado em</p>
                <p>Ações</p>
            </div>
            <div className="max-h-96 overflow-y-auto">
                {
                    cat && cat.map((c:Category) => (
                        <CategorieGrid key={c.id} categories={c} refreshCategories={getAllCategories}/>
                    ))
                }
            </div>            
        </div>
    </div>
  );
}

export default CategoriesPage;