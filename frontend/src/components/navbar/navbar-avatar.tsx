import { type TypedUser } from "@shared/types/auth.types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu"
import { Link, useNavigate, useRouter } from "@tanstack/react-router"
import { Button } from "../ui/button"
import { useMutation } from "@tanstack/react-query"
import { logoutUser, requireUserRole } from "@/utils/auth-client"
import { toast } from "sonner"
import AvatarAdmin from "./avatar/avatar-admin"
import { UserRoleTypes } from '@shared/drizzle/schema/user.schema';


interface NavbarAvatarProps {
    user: TypedUser
}

const NavbarAvatar = ({ user }: NavbarAvatarProps) => {
  const splitName = user.name.split(" ");
  const fallbackName = `${splitName[0].charAt(0).toUpperCase()}${splitName[1].charAt(0).toUpperCase()}`;

  const navigate = useNavigate();
  const router = useRouter();
  const isAdmin = requireUserRole(user, UserRoleTypes.ADMIN)


  const mutation = useMutation({
    mutationKey: ['auth-user-logout'],
    mutationFn: async () => {
      await logoutUser();
    },
    onSuccess: () => {
        router.invalidate();
        navigate({
            to: '/',
        });
    },
    onError: (error) => {
        toast.dismiss();
        toast.error("Logout failed. Please try again.");
        console.error("Logout error:", error);
    },
  })

  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild className="cursor-pointer">
          <Avatar className="scale-110">
            <AvatarImage src={user.image || ""} />
            <AvatarFallback className="text-xl" >{fallbackName}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[180px] mt-2 font-jersey15">
          <DropdownMenuLabel className="text-center text-lg">@{user.username}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup asChild className="flex flex-col items-center justify-center space-y-2 w-full">
            <NavbarAvatarItem title="Profile" to={'/'} />    
          </DropdownMenuGroup>
            {
              isAdmin === true && (
                <>
                  <DropdownMenuSeparator />
                  <AvatarAdmin />
                </>
              )
            }
          <DropdownMenuSeparator />
        <DropdownMenuGroup className="flex justify-center items-center space-x-2 w-full">
          <Button onClick={() => mutation.mutate()} className="h-[30px] m-2 text-base cursor-pointer hover:scale-105 transition-2">Logout</Button>
        </DropdownMenuGroup>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface NavbarAvatarItemProps extends React.ComponentProps<typeof Link> {
    title: string;
    
}

export const NavbarAvatarItem = ({ to, title }: NavbarAvatarItemProps) => {

    return (
        <DropdownMenuItem className="hover:bg-accent transition-2 w-full mx-auto">
          <Link to={to} className="text-center w-full font-normal transition-2 text-lg">
            {title}
          </Link>
        </DropdownMenuItem>
    )
}

export default NavbarAvatar