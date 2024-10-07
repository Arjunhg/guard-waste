// @ts-nocheck
'use client'
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { Button } from "./ui/button";
import { Menu, Coins, Leaf, Search, Bell, User, ChevronDown, LogIn, LogOut } from "lucide-react";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
  } from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { createUser, getUnreadNotifications, getUserBalance, getUserByEmail, markNotificationAsRead } from "@/utils/db/actions";
import { toast } from "react-toastify";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const clientId = process.env.NEXT_WEB3_AUTH_CLIENT_ID;

const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0xaa36a7",
    rpcTarget: "https://rpc.ankr.com/eth_sepolia",
    displayName: "Ethereum Sepolia Testnet",
    blockExplorerUrl: "https://sepolia.etherscan.io",
    ticker: "ETH",
    tickerName: "Ethereum",
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  };

const privateKeyProvider = new EthereumPrivateKeyProvider({
    config: { chainConfig },
});

const web3auth = new Web3Auth({
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.TESTNET,
    privateKeyProvider,
});

interface HeaderProps {
    onMenuClick: () => void;
    totalEarnings: number;
}

export default function Header( { onMenuClick, totalEarnings } : HeaderProps ) {

    const [provider, setProvider] = useState<IProvider | null>(null); //provider is the name of the network we are using
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState<any>(null);
    const pathname = usePathname();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const isMobile = useMediaQuery("(max-width: 768px)");
    const [balance, setBalance] = useState(0);

    console.log("Before balance is:", balance);

    const notify = ( msg:string ) => toast(msg);
    const notifyError = ( msg:string ) => toast.error(msg); 

    console.log('user info', userInfo);

    // this useEffect initialize web3 auth and also creates a new user for us
    useEffect(() => {

        const init  = async () => {

            try {

                await web3auth.initModal();
                setProvider(web3auth.provider); //provider is the name of the network we are using
                
                if(web3auth.connected ){
                    
                    await web3auth.connect(); 

                    setLoggedIn(true);

                    const user = await web3auth.getUserInfo();
                    setUserInfo(user);

                    if(user.email){

                        localStorage.setItem('userEmail', user.email);

                        try {

                            await createUser(user.email, user.name || 'Anonymous User'); //create CreateUser in actions.ts
                            
                        } catch (error) {

                            console.error("Error Creating User:", error);
                            
                        }

                    }
                }
                
            } catch (error) {

                console.error("Error initializing Web3Auth:", error);
                
            } finally {

                setLoading(false);

            }

        };

        init();
    }, []);


    // useEffect for fetching the notification
    useEffect(() => {

            const fetchNotifications = async () => {

                if(userInfo && userInfo.email){
        
                    const user = await getUserByEmail(userInfo.email);
        
                    if(user){
        
                        const unreadNotifications = await getUnreadNotifications(user.id);
                        setNotifications(unreadNotifications);
        
                    }
                }
            };
        
            fetchNotifications();

            // periodic checking for new notification
            const notificationInterval = setInterval(fetchNotifications, 30000); //every 30 seconds

            return () => clearInterval(notificationInterval); //to prevent memory leak or buffer overflow

        }, [userInfo]
    );

    // useEffect for fetching userBalance
    useEffect(() => {

        const fetchUserBalance = async() => {

            if(userInfo && userInfo.email){

                const user = await getUserByEmail(userInfo.email); //will give use logged in user info

                if(user){

                    const userBalance = await getUserBalance(user.id);
                    setBalance(userBalance);
                    console.log("user balance is:", userBalance);
                }
            }
        };

        fetchUserBalance();

        // Add event listener for balance update
        const handleBalanceUpdate = ( event: CustomEvent ) => {
            setBalance(event.detail);
        };

        window.addEventListener('balanceUpdated', handleBalanceUpdate as EventListener);

        return () => {
            window.removeEventListener('balanceUpdated', handleBalanceUpdate as EventListener);
        }

    },[userInfo]);

    // Login In function
    const login = async() => {

        if(!web3auth){

            console.log("Web3Auth not initialized yet")
            notifyError("Web3Auth not initialized yet");
            return;

        }

        try {

            const web3authProvider = await web3auth.connect();
            setProvider(web3authProvider);
            setLoggedIn(true);

            const user = await web3auth.getUserInfo();
            setUserInfo(user);

            if(user.email){

                localStorage.setItem('userEmail', user.email);

                try {

                    const existingUser = await getUserByEmail(user.email)
                    
                    if(existingUser){
                        notify("Welcome back");
                        return user;
                    }

                    await createUser(user.email, user.name || 'Anonymous User'); 
                    notify("User created successfully");

                    return user;
                    
                } catch (error) {
                    
                    console.log("Error creating user:", error)
                    notifyError("Error Creating User");

                }
            }

            return user;
            
        } catch (error) {

            console.error("Error logging in:", error);
            notifyError("Error logging in");

        }

    }

    // logout function
    const logout = async() => {

        if(!web3auth){

            console.log("Web3Auth not initialized yet")
            notifyError("Web3Auth not initialized yet");
            return;

        }

        try {

            await web3auth.logout();
            setProvider(null);
            setLoggedIn(false);
            setUserInfo(null);

            localStorage.removeItem('userEmail');
            notify("Logged out successfully");
            
        } catch (error) {
            
            console.error("Error logging out:", error);
            notifyError("Error logging out");

        }
    }

    // user info function. This is the info we get after clicking th dropdown
    const getUserInfo = async() => {

        if(web3auth.connected){

            const user = await web3auth.getUserInfo();
            setUserInfo(user);

            if(user.email){

                localStorage.setItem('userEmail', user.email);

                try {
                    
                    await createUser(user.email, user.name || 'Anonymous User');

                } catch (error) {
                    
                    console.error("Error creating user:", error);
                    notifyError("Error creating user");

                }
            }
        }
    }

    const handleNotificationClick = async( notificationId: number ) => {

        await markNotificationAsRead(notificationId);
        setNotifications( prevNotifications => 
            prevNotifications.filter(notification => notification.id !== notificationId)
        );
    };

    if(loading){
        return <div>Loading Web3Auth...</div>;
    }

    console.log("After balance is:", balance);
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

                                    notifications.map((notification:any) => (

                                        <DropdownMenuItem 
                                            key={notification.id}
                                            onClick={() => handleNotificationClick(notification.id)}
                                        >
                                            <div className="flex flex-col">
                                                <span className="font-medium">{notification.type}</span>
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
  




