type Transaction = {
  cat_id: string;
  created_at: string;
  desc: string;
  id: string;
  tran_date: string;
  type: "Despesa" | "Receita";
  user_id: string;
  value: number;
};

export const filterDespesaReceita = (dataSet:Transaction[]) => {
    const despesas = dataSet.filter(
        (data) => data.type === "Despesa"
    );

    const receitas = dataSet.filter(
        (data) => data.type === "Receita"
    );

    return({
        despesas,
        receitas,
    });
};