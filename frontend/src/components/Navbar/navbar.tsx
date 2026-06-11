import NavbarOption from "./navbarOption";


export function Navbar(){
  
  return (
    <div className="bg-[#060B14] w-[300px] min-h-screen px-5">
        <div className="flex items-center flex-col">
            <img src="src/assets/logo-tracker.png" alt="finance-tracker-logo" className="h-[150px]"/>
        </div>
        <div className="flex flex-col gap-3">
            <NavbarOption svgPath="src/assets/dashboard-icon.svg" label="Dashboard"/>
            <NavbarOption svgPath="src/assets/transaction-icon.svg" label="Transações"/>
            <NavbarOption svgPath="src/assets/category-icon.svg" label="Categorias"/>
        </div>        
    </div>
  );
}

export default Navbar;