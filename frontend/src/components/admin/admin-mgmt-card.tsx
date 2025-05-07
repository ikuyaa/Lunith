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
  const minLeftPadding = '1rem'; // Always have at least 1rem left padding
  

  return (
    <div
    className="fixed inset-0 flex justify-center items-center pt-12 transition-all duration-300 px-2 sm:px-6"
    style={{ paddingLeft: `calc(${sidebarWidth} + ${minLeftPadding})` }}
  >
    <Card className='w-full max-w-[100vw] sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl mx-auto h-[calc(100vh-10rem)] rounded-lg'>
      <CardHeader>
        <CardTitle className='text-center text-4xl'>{title}</CardTitle>
        <div>
          <Dialog>
            <DialogTrigger asChild className='mt-2'>
            <Button 
              className='w-full flex items-center md:justify-center lg:mx-0 mx-auto sm:w-[220px] h-8 text-xl hover:scale-105 active:scale-95 transition-all duration-200 ease-in-out' 
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