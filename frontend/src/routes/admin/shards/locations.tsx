import AdminManagementCard from '@/components/admin/admin-mgmt-card';
import CreateShardLocationDialog from '@/components/admin/shards/location/create-shard-location-dialog';
import { ShardLocationTable } from '@/components/admin/shards/location/shard-location-table';
import { Card, CardContent} from '@/components/ui/card';
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
        <div className='flex flex-col h-full'>  
          <Card className='w-full h-[calc(100vh-22rem)] mt-4 bg-secondary'>
            <CardContent className='h-full p-0'>
              <div className='h-full overflow-y-auto px-4'>
                <ShardLocationTable />
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminManagementCard>
    </div>
  )
}
