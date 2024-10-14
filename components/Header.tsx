'use client'
import Link from "next/link";
// import { usePathname } from 'next/navigation';
import { Button } from "./ui/button";
import { Menu, Coins, Leaf, Search, Bell, User, ChevronDown, LogIn } from "lucide-react";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
  } from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
// import { toast } from "react-toastify";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useAuth } from "@/app/context/AuthContext";


interface HeaderProps {
    onMenuClick: () => void;
    // totalEarnings: number;
}

export default function Header( { onMenuClick } : HeaderProps ) {

    
    const isMobile = useMediaQuery("(max-width: 768px)");

    const { loggedIn, login, userInfo, getUserInfo, logout, balance, notifications, handleNotificationClick} = useAuth();

    return(

        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">

            <div className="flex items-center justify-between px-4 py-2">

                <div className="flex items-center">

                    {/* Button for menu */}

                    <Button variant='ghost' size='icon' className="mr-2 md:mr-4" onClick={onMenuClick}>
                        <Menu className="h-6 w-6" />
                    </Button>

                    <Link href='/' className="flex items-center">

                        <Leaf className="h-6 w-6 md:h-8 md:w-8 text-green-500 mr-1 md:mr-2" />

                        <div className="flex flex-col">
                            <span className="font-bold text-base md:text-lg text-gray-800">GreenGuard</span>
                            <span className="text-[8px] md:text-[10px] text-gray-500 -mt-1">ETHOnline24</span>
                        </div>

                    </Link>

                </div>

                {/* For checking responsiveness create hook isMobile */}
                {
                    !isMobile && (
                        
                        <div className="flex-1 max-w-xl mx-4">

                            <div className="relative">

                                <input type="text" placeholder="search..." className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"/>
                                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2"/>

                            </div>
                        </div>
                    )
                }

                {/* notification icon, balance, user icon and dropdown */}
                <div className="flex items-center">

                    {
                        isMobile && (

                            <Button variant="ghost" size="icon" className="mr-2">
                              <Search className="h-5 w-5" />
                            </Button>

                          )
                    }

                    {/* drop down for notification */}
                    <DropdownMenu>

                        <DropdownMenuTrigger asChild>

                            <Button variant="ghost" size="icon" className="mr-2 relative">
                                <Bell className="h-5 w-5" />
                                {
                                    notifications.length > 0 && (
                                        <Badge className="absolute -top-1 -right-1 px-1 min-w-[1.2rem] h-5">
                                            {notifications.length}
                                        </Badge>
                                    )
                                }
                            </Button>

                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-64">

                            {
                                notifications.length > 0 ? (

                                    notifications.map((notification:Notification) => (

                                        <DropdownMenuItem 
                                        // @ts-expect-error - Notification type is not explicitly defined
                                            key={notification.id}
                                            // @ts-expect-error - Notification type is not explicitly defined
                                            onClick={() => handleNotificationClick(notification.id)}
                                        >
                                            <div className="flex flex-col">
                                             {/* @ts-expect-error - Notification type is not explicitly defined */}
                                                <span className="font-medium">{notification.type}</span>
                                                {/* @ts-expect-error - Notification type is not explicitly defined */}
                                                <span className="text-sm text-gray-500">{notification.message}</span>
                                            </div>
                                        </DropdownMenuItem>

                                    ))

                                ) : (
                                    <DropdownMenuItem>No new notifications</DropdownMenuItem>
                                )
                            }

                        </DropdownMenuContent>
                    </DropdownMenu>
                    {/*  */}

                    {/* Balance */}
                    <div className="mr-2 md:mr-4 flex items-center bg-gray-100 rounded-full px-2 md:px-3 py-1">

                        <Coins className="h-4 w-4 md:h-5 md:w-5 mr-1 text-green-500"></Coins>

                        <span className="font-semibold text-sm md:text-base text-gray-800">
                                {balance.toFixed(2)}
                        </span>

                    </div>
                    {/*  */}
                    
                    {/* User Dropdown */}
                    {
                        !loggedIn ? (

                            <Button onClick={login} className="bg-green-600 hover:bg-green-700 text-white text-sm md:text-base">
                                Login
                                <LogIn className="ml-1 md:ml-2 h-4 w-4 md:h-5 md:w-5"/>
                            </Button>

                        ) : (

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>

                                    <Button variant="ghost" size='icon' className="flex itemx-center">

                                        <User className="h-5 w-5 mr-1"/>

                                        <ChevronDown className="h-4 w-4"/>

                                    </Button>

                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end">

                                    <DropdownMenuItem onClick={getUserInfo}>
                                        {
                                            userInfo ? userInfo.name : "Fetch User Info"
                                        }
                                    </DropdownMenuItem>

                                    <DropdownMenuItem>
                                        <Link href='/settings'>Profile</Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem>Settings</DropdownMenuItem>

                                    <DropdownMenuItem onClick={logout}>Sign Out</DropdownMenuItem>

                                </DropdownMenuContent>

                            </DropdownMenu>
                        )
                    }
                    {/*  */}

                </div>
                {/*   */}

            </div>
             
        </header>
    )

}
  




