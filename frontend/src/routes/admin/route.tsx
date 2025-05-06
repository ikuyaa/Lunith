import AdminSidebar from '@/components/admin/admin-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { requireUserRole, validateSession } from '@/utils/auth-client'
import { UserRoleTypes } from '@shared/drizzle/schema/user.schema'
import type { TypedUser } from '@shared/types/auth.types'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/admin')({
  component: RouteComponent,
  loader: async () => {
    const { user } = await validateSession();
    const isAdmin = requireUserRole(user as TypedUser, UserRoleTypes.ADMIN);
    if(!isAdmin) {
      throw redirect({
        to: '/',
        replace: true,
      })
    }

    return {
      user,
    }
  }
})

function RouteComponent() {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className='w-24'>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
