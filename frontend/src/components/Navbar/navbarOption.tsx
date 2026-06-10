

export function NavbarOption({svgPath, label}: {svgPath: string, label: string}){
  
  return (
    
    <div className="flex items-center gap-5 cursor-pointer">
        <div className="w-[20px] h-[20px]">
            <img src={svgPath} alt="" />
        </div>
        <div>
            <p className="text-xl">{label}</p>
        </div>
    </div>
    
  );
}

export default NavbarOption;