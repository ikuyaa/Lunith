import { createFileRoute } from '@tanstack/react-router'
import AdminManagementCard from '@/components/admin/admin-mgmt-card'

export const Route = createFileRoute('/admin/shards/manage')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <AdminManagementCard title='⋆˙⟡ Manage your shards ⟡˙⋆' addButtonText='+ Create a shard'>

    </AdminManagementCard>
  )
}
