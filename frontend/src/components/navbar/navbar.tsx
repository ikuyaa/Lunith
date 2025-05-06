import { authClient } from "@/utils/auth-client"
import NavbarDesktop from "./navbar-desktop"

const Navbar = () => {
  const sessionData = authClient.useSession().data;
  const user = sessionData?.user;

  return (
    <nav className="fixed top-0 left-0 w-full z-50">
        {/* Desktop Navbar */}
        <div className="hidden md:block">
          <NavbarDesktop user={user} />
        </div>

        {/* Mobile Navbar */}
        <div className="md:hidden"> 

        </div>
    </nav>
  )
}

export default Navbar