import { Link } from "react-router-dom";


export function NavbarOption({svgPath, label, pagePath}: {svgPath: string, label: string, pagePath: string}){
  
  return (
    
    <Link to={pagePath}>
      <div className="flex items-center gap-5 cursor-pointer">
        <div className="w-[20px] h-[20px]">
            <img src={svgPath} alt="" />
        </div>
        <div>
            <p className="text-xl">{label}</p>
        </div>        
      </div>
    </Link>
    
  );
}

export default NavbarOption;