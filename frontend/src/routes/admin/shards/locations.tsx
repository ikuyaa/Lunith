import AdminManagementCard from '@/components/admin/admin-mgmt-card';
import CreateShardLocationDialog from '@/components/admin/shards/create-shard-location-dialog';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/shards/locations')({
  component: RouteComponent,
})

function RouteComponent() {

  return (
    <div>
      <AdminManagementCard 
        title='⋆˙⟡ Shard Locations ⟡˙⋆' 
        addButtonText='+ Create a shard location'
        dialogContent={ <CreateShardLocationDialog /> }
      >
        
      </AdminManagementCard>
    </div>
  )
}
