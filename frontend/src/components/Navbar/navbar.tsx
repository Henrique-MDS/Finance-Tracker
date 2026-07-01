import { useLogout } from "../Login_Register/LogOut";
import NavbarOption from "./navbarOption";


export function Navbar(){
  const logout = useLogout();
  return (
    <div className="bg-[#060B14] w-[250px] min-h-screen px-5">
        <div className="flex items-center flex-col">
            <img src="src/assets/logo-tracker.png" alt="finance-tracker-logo" className="h-[150px]"/>
        </div>
        <div className="flex flex-col gap-3">
            <NavbarOption svgPath="src/assets/dashboard-icon.svg" label="Dashboard" pagePath="/"/>
            <NavbarOption svgPath="src/assets/transaction-icon.svg" label="Transações" pagePath="Transactions"/>
            <NavbarOption svgPath="src/assets/category-icon.svg" label="Categorias" pagePath="Categories"/>
            <NavbarOption svgPath="src/assets/logout-icon.svg" label="Sair" onClick={logout}/>
        </div>        
    </div>
  );
}

export default Navbar;