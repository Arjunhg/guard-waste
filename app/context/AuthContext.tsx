import React, { createContext, useState, useEffect, useContext } from 'react';
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { createUser, getUnreadNotifications, getUserBalance, getUserByEmail, markNotificationAsRead } from "@/utils/db/actions";
import { toast } from "react-toastify";

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
  // @ts-expect-error - may initially be null
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.TESTNET,
  privateKeyProvider,
});

interface AuthContextType {
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getUserInfo: () => void;
  handleNotificationClick: (notificationid: number) => Promise<void>;
  loggedIn: boolean;
  balance: number;
  notifications: Notification[];
  userInfo: { email?: string; name?: string } | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [, setProvider] = useState<IProvider | null>(null); //provider is the name of the network we  are using
  const [loggedIn, setLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<{ email?: string; name?: string } | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.initModal();
        setProvider(web3auth.provider);
        
        if (web3auth.connected) {
          await web3auth.connect();
          setLoggedIn(true);
          const user = await web3auth.getUserInfo();
          setUserInfo(user);
          if (user.email) {
            localStorage.setItem('userEmail', user.email);
            try {
              await createUser(user.email, user.name || 'Anonymous User');
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

  useEffect(() => {
    const fetchUserBalance = async () => {
      if (userInfo && userInfo.email) {
        const user = await getUserByEmail(userInfo.email);
        if (user) {
          const userBalance = await getUserBalance(user.id);
          setBalance(userBalance);
        }
      }
    };

    fetchUserBalance();

    const handleBalanceUpdate = (event: CustomEvent) => {
      setBalance(event.detail);
    };

    window.addEventListener('balanceUpdated', handleBalanceUpdate as EventListener);

    return () => {
      window.removeEventListener('balanceUpdated', handleBalanceUpdate as EventListener);
    };
  }, [userInfo]);

  // useEffect for fetching the notification
  useEffect(() => {

    const fetchNotifications = async () => {

        if(userInfo && userInfo.email){

            const user = await getUserByEmail(userInfo.email);

            if(user){

                const unreadNotifications = await getUnreadNotifications(user.id);
                // @ts-expect-error - Notification type is not explicitly defined
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


  const login = async () => {
    if (!web3auth) {
      toast.error("Web3Auth not initialized yet");
      return;
    }

    try {
      const web3authProvider = await web3auth.connect();
      setProvider(web3authProvider);
      setLoggedIn(true);
      const user = await web3auth.getUserInfo();
      setUserInfo(user);

      if (user.email) {
        localStorage.setItem('userEmail', user.email);
        try {
          const existingUser = await getUserByEmail(user.email);
          if (existingUser) {
            toast("Welcome back");
          } else {
            await createUser(user.email, user.name || 'Anonymous User');
            toast("User created successfully");
          }
        } catch (error) {
          console.error("Error creating user:", error);
          toast.error("Error Creating User");
        }
      }
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error("Error logging in");
    }
  };

  const logout = async () => {
    if (!web3auth) {
      toast.error("Web3Auth not initialized yet");
      return;
    }

    try {
      await web3auth.logout();
      setProvider(null);
      setLoggedIn(false);
      setUserInfo(null);
      localStorage.removeItem('userEmail');
      toast("Logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Error logging out");
    }
  };

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

            }
        }
    }
}

  const handleNotificationClick = async( notificationId: number ) => {

    await markNotificationAsRead(notificationId);
    setNotifications( prevNotifications => 
        // @ts-expect-error - Notification type is not explicitly defined
        prevNotifications.filter(notification => notification.id !== notificationId)
    );
  };


  if(loading){
    return <div>Loading Web3Auth...</div>
  }

  return (
    <AuthContext.Provider value={{ loggedIn, userInfo, login, logout, balance, getUserInfo, notifications, handleNotificationClick }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};