"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { SidebarOptions } from "@/service/Constants"
import { Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"


export function AppSidebar() {

    const path= usePathname();

  return (
    <Sidebar>
      <SidebarHeader className={'flex justify-center items-center'}><Image src={'/Logo1.jpg'}  width={100} height={100} alt='logo'/>
      <button className="flex h-10 justify-center items-center bg-black rounded-2xl w-full text-amber-50 mt-5"> <Plus/> Create a new interview </button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
        <SidebarContent>
        <SidebarMenu>{SidebarOptions.map((option,index)=>(
            <SidebarMenuItem className={`${path===option.path&&'text-primary'&&'bg-blue-100'}`} key={index} >
            <SidebarMenuButton asChild>
            <Link href={option.path}>
                <option.icon/>
                <span>{option.name}</span>
                </Link>
            
            </SidebarMenuButton>
            </SidebarMenuItem>
       ))}</SidebarMenu>
        </SidebarContent>
        </SidebarGroup>
        <SidebarGroup></SidebarGroup>
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar