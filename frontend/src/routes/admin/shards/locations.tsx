import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/shards/locations')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="fixed inset-0 flex justify-center items-center pl-56 pt-12">
      <Card className='w-[calc(100vw-26rem)] h-[calc(100vh-10rem)]'>
      <CardHeader>
        <CardTitle className='text-center text-4xl'>🌐 Manage your shard locations 🌐</CardTitle>
      </CardHeader>
      <CardContent> 
        <div className='flex justify-center items-center w-full md:block' >
          <Button 
          className=' w-[220px] h-8 text-xl hover:scale-105 active:scale-95 transition-all duration-200 ease-in-out' 
          variant='default'>
            + Create a shard location
          </Button>
        </div>
      </CardContent>
      </Card>
    </div>
  )
}
