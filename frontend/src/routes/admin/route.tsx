import AdminSidebar from '@/components/admin/admin-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/admin')({
  component: RouteComponent,
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
