import { DropdownMenuGroup } from "@/components/ui/dropdown-menu"
import { NavbarAvatarItem } from "../navbar-avatar"


const AvatarAdmin = () => {
  return (
    <DropdownMenuGroup className="flex flex-col items-center justify-center space-y-2 w-full">
      <NavbarAvatarItem title="Admin Panel" to={'/admin'} />    
    </DropdownMenuGroup>
  )
}

export default AvatarAdmin