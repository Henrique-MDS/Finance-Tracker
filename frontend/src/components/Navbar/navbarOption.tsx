import { Link } from "react-router-dom";

interface NavbarOptionProps {
  svgPath: string;
  label: string;
  pagePath?: string;
  onClick?: () => void;
}

export function NavbarOption({ svgPath, label, pagePath, onClick }: NavbarOptionProps) {
  const content = (
    <div className="flex items-center gap-5 cursor-pointer">
      <div className="w-[20px] h-[20px]">
        <img src={svgPath} alt={label} />
      </div>
      <div>
        <p className="text-xl">{label}</p>
      </div>
    </div>
  );

  if (pagePath) {
    return <Link to={pagePath}>{content}</Link>;
  }

  if (onClick) {
    return <div onClick={()=>onClick()}>{content}</div>;
  }

  return content;
}

export default NavbarOption;