import { Link } from '@tanstack/react-router'
import { type LucideIcon } from 'lucide-react'
import React from 'react'

interface NavbarLinkProps extends React.ComponentProps<typeof Link> {
    title: string
    Icon: LucideIcon;
}

const NavbarLink = ({to, title, Icon }: NavbarLinkProps) => {
  return (
    <Link to={to} className='text-xl group'>
        <div className="flex items-center space-x-2 relative">
            <Icon size={18} className="self-center relative top-[-1]" />
            <p className="self-center text-3xl">{title}</p>
            <div className="absolute left-0 right-0 -bottom-0 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full group-hover:opacity-100 opacity-0 rounded" />
        </div>
    </Link>
  )
}

export default NavbarLink