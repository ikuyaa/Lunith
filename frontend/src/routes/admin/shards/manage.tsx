import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/shards/manage')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="fixed inset-0 flex justify-center items-center pl-56">
      <Card className='w-[calc(100vw-26rem)] h-[calc(100vh-10rem)]'>
      <CardHeader>
        <CardTitle className='text-center text-4xl'> ⋆˙⟡ Manage your shards ⟡˙⋆</CardTitle>
      </CardHeader>
      <CardContent> 
        <div>
          <Button className='w-[200px] h-10 text-xl hover:scale-105 active:scale-95 transition-all duration-200 ease-in-out' variant='default'>
            + Create a shard
          </Button>
        </div>
      </CardContent>
      </Card>
    </div>
  )
}
