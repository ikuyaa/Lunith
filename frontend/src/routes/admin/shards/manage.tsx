import { createFileRoute } from '@tanstack/react-router'
import AdminManagementCard from '@/components/admin/admin-mgmt-card'
import CreateShardDialog from '@/components/admin/shards/manage/create-shard-dialog'

export const Route = createFileRoute('/admin/shards/manage')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <AdminManagementCard 
      title='⋆˙⟡ Manage your shards ⟡˙⋆' 
      addButtonText='+ Create a shard'
      dialogContent={< CreateShardDialog />}
    >

    </AdminManagementCard>
  )
}
