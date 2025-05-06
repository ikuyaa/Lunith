import { Link } from "@tanstack/react-router"
import { ThemeToggle } from "../theme-toggle"
import { Button } from "../ui/button"
import { type TypedUser } from '@shared/types/auth.types';
import { Home, Server } from "lucide-react";
import NavbarLink from "./navbar-link";
import NavbarAvatar from "./navbar-avatar";
import Logo from '@/assets/logos/logo-transparent.png';
interface NavbarDesktopProps {
    user?: TypedUser | null
}

const NavbarDesktop = ({ user }: NavbarDesktopProps) => {
  return (
    <div className="flex items-center justify-between w-full px-4 py-2 border-b-[1.5px] border-b-muted relative">
      {/* Left Side */}
      <div className="flex-1 flex items-center justify-start gap-2 min-w-0">
        <div className="w-[50px] h-[50px] flex items-center justify-center">
          <img src={Logo} className="w-[40px] h-[40px] object-contain transition-transform duration-200 hover:scale-105" />
        </div>
        <p className="text-2xl pb-1 cursor-default text-center whitespace-nowrap overflow-hidden text-ellipsis">{import.meta.env.VITE_APP_NAME}</p>
      </div>
      {/* Center */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center space-x-4">
        <NavbarLink
          to='/'
          title="Home"
          Icon={Home}
        />
        <NavbarLink
          to='/'
          title="Servers"
          Icon={Server}
        />
      </div>
      {/* Right Side */}
      <div className="flex-1 flex items-center justify-end">
        {/* Right content here */}
        <div className="flex items-center space-x-6 pr-18">
            {
                !user ? (
                  <div className="space-x-4">
                    <Button className="h-[30px] w-[85px] text-xl">
                      <Link to="/auth/login">
                        Login
                      </Link>
                    </Button>
                    <Button className="h-[30px] w-[85px] text-xl">
                      <Link to="/auth/register">
                        Register
                      </Link>
                    </Button>
                  </div>
                    
                ) : (
                  <div>
                    <NavbarAvatar user={user} />
                  </div>
                )
            }
            <ThemeToggle />
        </div>
        
      </div>
    </div>
  )
}

export default NavbarDesktop