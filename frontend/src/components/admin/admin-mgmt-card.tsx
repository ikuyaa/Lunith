import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { useSidebar } from '../ui/sidebar';
import { Dialog } from '../ui/dialog';
import { DialogTrigger } from '@radix-ui/react-dialog';

interface AdminManagementCardProps {    
    children?: React.ReactNode;
    title: string;
    addButtonText: string; 
    dialogContent?: React.ReactNode; // Add this prop
}

const AdminManagementCard = ({children, title, addButtonText, dialogContent}: AdminManagementCardProps) => {
  const { state } = useSidebar();
  // Sidebar widths: expanded = 16rem, collapsed = 0rem
  const sidebarWidth = state === 'expanded' ? '16rem' : '0rem';
  

  return (
    <div
    className="fixed inset-0 flex justify-center items-center pt-12 transition-all duration-300"
    style={{ paddingLeft: sidebarWidth }}
  >
    <Card className='w-[calc(100vw-26rem)] h-[calc(100vh-10rem)]'>
      <CardHeader>
        <CardTitle className='text-center text-4xl'>{title}</CardTitle>
        <div>
          <Dialog>
            <DialogTrigger asChild>
            <Button 
              className='w-[220px] h-8 text-xl hover:scale-105 active:scale-95 transition-all duration-200 ease-in-out' 
              variant='default'
            >
              {addButtonText}
            </Button>
            </DialogTrigger>
            {/* Render dialogContent if provided */}
            {dialogContent}
          </Dialog>
        </div>
      </CardHeader>
      <CardContent> 
        {children}
      </CardContent>
    </Card>
  </div>
  )
}

export default AdminManagementCard