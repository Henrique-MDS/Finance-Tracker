import { useLogout } from "../Login_Register/LogOut";
import NavbarOption from "./navbarOption";


export function Navbar(){
  const logout = useLogout();
  return (
    <div className="hidden lg:block fixed top-0 left-0 h-screen w-[250px] bg-[#060B14] px-5">
      <div className="flex items-center flex-col">
        <img src="src/assets/logo-tracker.png" alt="finance-tracker-logo" className="h-[150px]"/>
      </div>
      <div className="flex flex-col gap-3 justify-between">
        <div>
          <NavbarOption svgPath="src/assets/dashboard-icon.svg" label="Dashboard" pagePath="/"/>
          <NavbarOption svgPath="src/assets/transaction-icon.svg" label="Transações" pagePath="Transactions"/>
          <NavbarOption svgPath="src/assets/category-icon.svg" label="Categorias" pagePath="Categories"/>
        </div>
        <div>
          <NavbarOption svgPath="src/assets/logout-icon.svg" label="Sair" onClick={logout}/>
        </div>
      </div>        
    </div>
  );
}

export default Navbar;