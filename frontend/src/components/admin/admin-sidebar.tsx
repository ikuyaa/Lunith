import { ChevronRight, Server } from "lucide-react"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger, useSidebar } from "../ui/sidebar"
import { AdminSearchForm } from "./admin-search-form"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible"
import { Link } from "@tanstack/react-router"

const AdminSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const { state } = useSidebar()
  return (
    <>
      {/* Fixed trigger at screen edge when sidebar is collapsed */}
      <SidebarTrigger
        className={`fixed top-[70px] left-2 z-30 md:flex hidden items-center justify-center transition-all duration-300 ease-in-out w-7 h-7
          ${state === "collapsed" ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}
      />
      <Sidebar 
        {...props} 
        className={`mt-[66px] max-h-[calc(100vh-66px)] overflow-auto rounded-tr-xl relative transition-all duration-300 ease-in-out
          ${state === "expanded" 
            ? 'opacity-100 translate-x-0' 
            : 'opacity-0 -translate-x-full'}`}
      >
        {/* Absolutely position trigger at top right when expanded */}
        <SidebarTrigger
          className={`absolute top-2 right-2 z-20 md:flex hidden items-center justify-center transition-all duration-300 ease-in-out w-7 h-7
            ${state === "expanded" ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}`}
        />
        <SidebarHeader className="transition-all duration-300 ease-in-out">
          <span className="text-2xl text-center transition-all duration-300 ease-in-out">{import.meta.env.VITE_APP_NAME} Admin Panel</span>
          <AdminSearchForm className="flex items-center justify-center transition-all duration-300 ease-in-out" />
        </SidebarHeader>
        <SidebarContent className="transition-all duration-300 ease-in-out">
          {/* Creating a collapsible SidebarGroup for each parent of data */}
          {data.nav.map((item) => (
            <Collapsible 
              key={item.title}
              title={item.title}
              defaultOpen
              className="group/collapsible transition-all duration-300 ease-in-out"
            >
              <SidebarGroup>
                <SidebarGroupLabel
                  asChild
                  className="group/label text-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-300 ease-in-out"
                >
                  <CollapsibleTrigger>
                    <p className="text-2xl transition-all duration-300 ease-in-out">{item.title}{" "}</p>
                    <ChevronRight className="ml-auto transition-transform duration-300 ease-in-out group-data-[state=open]/collapsible:rotate-90" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent className="transition-all duration-300 ease-in-out">
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {item.items.map((item) => (
                        <SidebarMenuItem key={item.title} className="transition-all duration-300 ease-in-out">
                          <SidebarMenuButton asChild isActive={item.isActive} className="transition-all duration-300 ease-in-out">
                            <Link to={item.url} className="hover:text-white active:text-white pl-6 text-xl transition-all duration-300 ease-in-out">- {item.title}</Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          ))}
        </SidebarContent>
      </Sidebar>
    </>
  )
}

const data = {
  nav: [
    {
      title: "Shards",
      icon: Server,
      items: [
        {
          title: 'Shard Management',
          url: '/admin/shards/manage',
          isActive: false,
        },
        {
          title: 'Shard Locations',
          url: '/admin/shards/locations',
        }
      ]
    }
  ]
}

export default AdminSidebar