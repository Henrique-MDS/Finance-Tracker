import { useLanguage } from "@/i18n/LanguageContext";
import { translateCategory } from "@/i18n/i18n";
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
import { Toaster } from "react-hot-toast";
import { defaultIcons } from "@/Utils/icons";
import { UserSearch } from "lucide-react";
import { useAuth } from "@/Utils/AuthContext";
import { Navigate } from "react-router-dom";
import type { Category } from "@/types/generalTypes";

export function CategoriesPage() {

    const [cat, setCat] = useState<Category[]>([]);
    const [filteredCat, setFilteredCat] = useState<Category[]>([]);
    const [catName, setCatName] = useState("");
    const [selectedIcon, setSelectedIcon] = useState("money");
    const { user, loading } = useAuth();
    const { t } = useLanguage();

    if (loading) {
        return <div>{t("common.loading")}</div>;
    }
    if (!user) {
        return <Navigate to="/Login" replace />;
    }
    const userId = user.id;

    const getAllCategories = async () => {
        const categories = await getData(
            "Categories",
            {user_id: userId},
            "Buscar todas as categorias"
        );

        if(categories.success){
            setCat(categories.data ?? []);
            setFilteredCat(categories.data ?? []);
        } else {
            notify.error(t("common.fetchCategoriesError"));
            return;
        }
    }

    useEffect(() => {
        getAllCategories();
    }, [userId])
    
    const saveCategory = async () => {
        if(verifyForm([catName])){
            if(catName.length > 20){
                notify.error(t("categories.nameTooLong"));
                return;
            }

            const saveResponse = await insertData(
                "Categories",
                {
                    user_id: userId,
                    name: catName,
                    icon: selectedIcon
                },
                "Inserir categoria"
            );
            
            if(saveResponse.success){
                notify.success(t("categories.added"));
                getAllCategories();
            } else {
                if(saveResponse.error.code == "23505"){
                    notify.error(t("categories.exists"));
                } else {
                    notify.error(t("categories.addError"));
                }                
            }
            setCatName("");
        }        
    }
    
    const filterCategory = (e:any) => {
        const value = e.target.value.toLowerCase();

        const filtered = cat.filter((c) =>
            translateCategory(c.name).toLowerCase().includes(value)
        );

        setFilteredCat(filtered);
    }


  return (
    <div className="flex flex-col gap-4">
        <Toaster />
        <div className="flex flex-col gap-2">
            <h1 className="text-2xl text-foreground">{t("categories.title")}</h1>
            <p>{t("categories.subtitle")}</p>
        </div>
        <div className="bg-subdiv-padrao p-5 rounded-xl text-foreground flex flex-col gap-5">
            <h1 className="text-green-padrao text-xl">{t("categories.new")}</h1>
            <div className="flex flex-col gap-2">
                <p>{t("categories.name")}</p>
                <div className="flex items-center gap-2">
                    <Field>
                        <Input id="input-demo-api-key" type="text" placeholder={t("categories.namePlaceholder")} onChange={(e) => setCatName(e.target.value)} value={catName}/>
                    </Field>
                    <Button className="bg-green-padrao cursor-pointer" onClick={() => saveCategory()}>{t("common.save")}</Button>
                </div>                
            </div>
            <div className="flex flex-col gap-3 bg-subdiv2-padrao p-8 rounded-xl">
            <h3 className="flex gap-2">
              <span>
                <UserSearch className="text-blue-padrao"/>
              </span>
              {t("categories.chooseIcon")}
            </h3>
            <p className="text-sm text-text-padrao">{t("categories.chooseIconDesc")}</p>
            <div>
              <div className="grid sm:grid-cols-3 lg:grid-cols-8 gap-3">
                {defaultIcons.map(({ name, icon: Icon }) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setSelectedIcon(name)}
                    className={`flex items-center justify-center rounded-lg border p-3 cursor-pointer
                    ${
                      selectedIcon === name
                        ? "border-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    <Icon size={24} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div> 
        <div className="bg-subdiv-padrao p-5 rounded-xl text-foreground flex flex-col gap-5">
            <div className="flex items-center justify-between">
                <h2 className="text-emerald-300 text-xl">{t("categories.yours")}</h2>
                <Field className="w-72">
                    <Input id="input-demo-api-key" type="text" placeholder={t("categories.namePlaceholder")} 
                           onChange={(e) => filterCategory(e)}
                           />
                </Field>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-sm text-text-padrao">
                <p>{t("categories.colName")}</p>
                <p>{t("categories.colCreated")}</p>
                <p>{t("categories.colActions")}</p>
            </div>
            <div className="max-h-96 overflow-y-auto scrollbar-hide">
                {
                    cat && filteredCat.map((c:Category) => (
                        <CategorieGrid key={c.id} categories={c} refreshCategories={getAllCategories}/>
                    ))
                }
            </div>            
        </div>
    </div>
  );
}

export default CategoriesPage;