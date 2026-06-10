

export function ResumeCard({title, value, desc, emoji, themeColor, bgColor}: 
    {title: string, value: number, desc: string, emoji:string, themeColor: string, bgColor: string}) 
{
  
  return (
    <div className="bg-[#0E1621] py-5 px-10 rounded-xl w-auto shadow-md flex flex-col gap-3">
        <div className="flex gap-3">
            <div className="h-fit p-2 rounded-full" style={{ backgroundColor: bgColor}}>
                <span>{emoji}</span>
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