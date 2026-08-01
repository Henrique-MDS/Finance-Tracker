

export function ResumeCard({title, value, desc, icon, themeColor, bgColor}: 
    {title: string, value: number, desc: string, icon:string, themeColor: string, bgColor: string}) 
{
  
  return (
    <div className="bg-dark-padrao py-5 px-10 rounded-xl w-auto shadow-md flex flex-col gap-3 flex-grow">
        <div className="flex gap-3">
            <div className="h-fit p-3 rounded-full" style={{ backgroundColor: bgColor}}>
                <img src={icon} alt="" className="w-[30px]"/>
            </div>
            <div>
                <p className="">{title}</p>
                <p className="text-2xl font-medium" style={{ color: themeColor }}>R$ {value}</p>
            </div>            
        </div>             
        <p>{desc}</p>
    </div>
  );
}

export default ResumeCard;